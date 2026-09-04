import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Bilingual, Lang } from '@/types'
import { translations, type TranslationKey } from '@/i18n/translations'

interface LanguageContextValue {
  lang: Lang
  setLang: (l: Lang) => void
  t: (key: TranslationKey) => string
  tb: (value: Bilingual) => string
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => (localStorage.getItem('abn_lang') as Lang) || 'en')

  const setLangPersist = (l: Lang) => {
    setLang(l)
    localStorage.setItem('abn_lang', l)
  }

  const value = useMemo<LanguageContextValue>(
    () => ({
      lang,
      setLang: setLangPersist,
      t: (key) => translations[key]?.[lang] ?? translations[key]?.en ?? key,
      tb: (value) => value[lang] ?? value.en,
    }),
    [lang],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
