import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, Bell, ChevronDown, Globe, LogOut, User as UserIcon } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { useAuth } from '@/context/AuthContext'

export function Header() {
  const { lang, setLang, t } = useLanguage()
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const langRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
      }
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setLangOpen(false)
      }
    }
    if (menuOpen || langOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [menuOpen, langOpen])

  return (
    <header className="flex items-center gap-3 border-b border-line bg-surface px-4 py-3 sm:px-6">
      <div className="relative hidden flex-1 max-w-xl sm:block">
        <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" />
        <input
          type="text"
          placeholder={t('search_placeholder')}
          className="focus-ring w-full rounded-xl border border-line bg-canvas py-2.5 pl-9 pr-3 text-sm placeholder:text-ink-soft/70"
        />
      </div>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <div className="relative" ref={langRef}>
          <button
            onClick={() => setLangOpen((o) => !o)}
            className="focus-ring flex items-center gap-1.5 rounded-xl border border-line px-3 py-2 text-xs font-medium text-ink-soft hover:bg-canvas"
            aria-label="Select language"
          >
            <Globe size={14} />
            {lang === 'en' ? 'EN' : lang === 'ta' ? 'தமிழ்' : 'हिंदी'}
            <ChevronDown size={12} className="text-ink-soft" />
          </button>
          {langOpen && (
            <div className="absolute right-0 top-full z-50 mt-2 w-36 rounded-2xl border border-line bg-surface p-1.5 shadow-xl animate-in fade-in slide-in-from-top-2 duration-150">
              {[
                { code: 'en' as const, label: 'English (EN)' },
                { code: 'ta' as const, label: 'தமிழ் (Tamil)' },
                { code: 'hi' as const, label: 'हिंदी (Hindi)' },
              ].map((l) => (
                <button
                  key={l.code}
                  onClick={() => {
                    setLang(l.code)
                    setLangOpen(false)
                  }}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition-colors ${
                    lang === l.code ? 'bg-brand-50 text-brand-600 font-semibold' : 'text-ink-soft hover:bg-canvas hover:text-ink'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <button className="focus-ring relative rounded-xl border border-line p-2.5 text-ink-soft hover:bg-canvas" aria-label="Notifications">
          <Bell size={16} />
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-bad-500 text-[10px] font-semibold text-white">
            3
          </span>
        </button>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="focus-ring flex items-center gap-2 rounded-xl border border-line py-1.5 pl-1.5 pr-2.5 hover:bg-canvas"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-600">
              {(user?.name ?? 'U').slice(0, 1).toUpperCase()}
            </span>
            <span className="hidden text-sm font-medium text-ink sm:inline">{user?.name ?? 'User'}</span>
            <ChevronDown size={14} className="text-ink-soft" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-2xl border border-line bg-surface p-2 shadow-xl animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center gap-2.5 rounded-xl bg-canvas p-2.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-500 text-sm font-bold text-white">
                  {(user?.name ?? 'U').slice(0, 1).toUpperCase()}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink">{user?.name ?? 'User'}</p>
                  <p className="truncate text-xs text-ink-soft">{user?.email ?? 'user@example.com'}</p>
                </div>
              </div>
              <div className="my-1.5 border-t border-line" />
              <Link
                to="/app/profile"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-ink-soft hover:bg-canvas hover:text-ink transition-colors"
              >
                <UserIcon size={16} />
                Profile &amp; Settings
              </Link>
              <div className="my-1.5 border-t border-line" />
              <button
                onClick={() => {
                  setMenuOpen(false)
                  logout()
                }}
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
              >
                <LogOut size={16} />
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
