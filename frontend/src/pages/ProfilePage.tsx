import { BadgeCheck, LogOut, Trash2, ShieldCheck } from 'lucide-react'
import { Card, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'

export function ProfilePage() {
  const { user, logout } = useAuth()
  const { lang, setLang } = useLanguage()

  if (!user) return null

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-xl font-bold text-ink">Profile & Settings</h1>
        <p className="text-sm text-ink-soft">Manage your identity, language and privacy preferences.</p>
      </div>

      <Card>
        <CardHeader title="Profile" />
        <div className="mb-4 flex items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-100 text-lg font-bold text-brand-600">
            {user.name.slice(0, 1).toUpperCase()}
          </span>
          <div>
            <p className="font-medium text-ink">{user.name}</p>
            <p className="text-sm text-ink-soft">{user.email}</p>
          </div>
        </div>
        <p className="mb-1.5 text-xs text-ink-soft">Profile completion — {user.profileCompletion}%</p>
        <ProgressBar value={user.profileCompletion} />
      </Card>

      <Card>
        <CardHeader title="Verifications" />
        <div className="space-y-2">
          {user.verifications.map((v) => (
            <div key={v.label} className="flex items-center gap-2 text-sm">
              <BadgeCheck size={16} className={v.verified ? 'text-good-500' : 'text-line'} />
              <span className={v.verified ? 'text-ink' : 'text-ink-soft'}>{v.label}</span>
              {!v.verified && (
                <button className="ml-auto text-xs font-medium text-brand-600">Add</button>
              )}
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <CardHeader title="Language" />
        <div className="flex gap-2">
          {(['en', 'ta'] as const).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`focus-ring rounded-xl px-4 py-2 text-sm font-medium ${
                lang === l ? 'bg-brand-500 text-white' : 'border border-line text-ink-soft hover:bg-canvas'
              }`}
            >
              {l === 'en' ? 'English' : 'தமிழ்'}
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <CardHeader title="Privacy" />
        <p className="mb-3 flex items-start gap-2 text-sm text-ink-soft">
          <ShieldCheck size={16} className="mt-0.5 shrink-0 text-teal-600" />
          Uploaded documents are stored only for as long as needed to guide your application and are never shown to
          other users. You can delete any scanned document at any time from the Documents page.
        </p>
        <Button variant="outline" icon={<Trash2 size={14} />}>
          Request data deletion
        </Button>
      </Card>

      <Button variant="ghost" icon={<LogOut size={14} />} onClick={logout}>
        Log out
      </Button>
    </div>
  )
}
