import { Link, useNavigate } from 'react-router-dom'
import { Send, ShieldCheck, BadgeCheck, FileCheck2, Route, BellRing, ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { Card, CardHeader } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'
import { useAppData } from '@/context/AppDataContext'
import { findServiceById, services } from '@/data/services'

const quickChips = ['pan-card', 'passport', 'driving-licence', 'income-certificate']

const statusTone = {
  completed: 'good',
  in_progress: 'brand',
  documents_pending: 'warn',
  not_started: 'neutral',
  submitted: 'brand',
} as const

const statusLabel: Record<string, string> = {
  completed: 'Completed',
  in_progress: 'In Progress',
  documents_pending: 'Documents Pending',
  not_started: 'Not Started',
  submitted: 'Submitted',
}

export function DashboardPage() {
  const { user } = useAuth()
  const { t, tb } = useLanguage()
  const { applications } = useAppData()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  const goToAssistant = () => {
    if (query.trim()) navigate(`/app/assistant?q=${encodeURIComponent(query.trim())}`)
    else navigate('/app/assistant')
  }

  const activeApp = applications.find((a) => a.status === 'in_progress') ?? applications[0]
  const activeService = activeApp ? findServiceById(activeApp.serviceId) : undefined
  const roadmapProgress = activeService && activeApp ? Math.round(((activeApp.currentStepIndex + 1) / activeService.steps.length) * 100) : 0

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Hero / assistant prompt */}
      <Card className="relative overflow-hidden">
        <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <h1 className="font-display text-2xl font-bold text-ink">
              {t('hello')}, {user?.name ?? 'there'} 👋
            </h1>
            <p className="mt-1 text-sm text-ink-soft">{t('assistant_intro')}</p>

            <div className="mt-4 flex gap-2">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && goToAssistant()}
                placeholder="e.g. I want to start a bakery in Chennai"
                className="focus-ring w-full max-w-xl rounded-xl border border-line bg-canvas px-4 py-2.5 text-sm"
              />
              <Button onClick={goToAssistant} icon={<Send size={14} />}>
                Ask
              </Button>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {quickChips.map((id) => {
                const s = findServiceById(id)
                if (!s) return null
                return (
                  <Link
                    key={id}
                    to={`/app/services/${id}`}
                    className="focus-ring rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-medium text-ink-soft hover:bg-canvas"
                  >
                    {tb(s.name)}
                  </Link>
                )
              })}
            </div>
          </div>
          <span className="hidden h-24 w-24 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-100 to-teal-100 text-brand-600 md:flex">
            <ShieldCheck size={40} />
          </span>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          {/* Roadmap widget */}
          {activeService && activeApp ? (
            <Card>
              <CardHeader
                title={
                  <span className="flex items-center gap-2">
                    <Route size={16} className="text-brand-500" /> My Roadmap — {tb(activeService.name)}
                  </span>
                }
                action={
                  <Link to="/app/roadmap" className="text-sm font-medium text-brand-600">
                    View Full Roadmap
                  </Link>
                }
              />
              <div className="mb-4 flex items-center gap-2 overflow-x-auto pb-2">
                {activeService.steps.map((step, i) => {
                  const done = i < activeApp.currentStepIndex
                  const current = i === activeApp.currentStepIndex
                  return (
                    <div key={step.id} className="flex items-center">
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                          done
                            ? 'bg-good-500 text-white'
                            : current
                              ? 'bg-brand-500 text-white'
                              : 'bg-canvas text-ink-soft'
                        }`}
                        title={tb(step.title)}
                      >
                        {i + 1}
                      </div>
                      {i < activeService.steps.length - 1 && <div className="h-0.5 w-6 bg-line" />}
                    </div>
                  )
                })}
              </div>
              <div className="grid gap-4 sm:grid-cols-4">
                <div className="sm:col-span-2">
                  <p className="mb-1 text-xs text-ink-soft">Overall Progress</p>
                  <p className="mb-1.5 text-lg font-bold text-ink">{roadmapProgress}%</p>
                  <ProgressBar value={roadmapProgress} />
                </div>
                <div>
                  <p className="text-xs text-ink-soft">Total Steps</p>
                  <p className="text-lg font-bold text-ink">{activeService.steps.length}</p>
                </div>
                <div>
                  <p className="text-xs text-ink-soft">Current Step</p>
                  <p className="text-lg font-bold text-brand-600">{activeApp.currentStepIndex + 1}</p>
                </div>
              </div>
            </Card>
          ) : (
            <Card>
              <CardHeader
                title={
                  <span className="flex items-center gap-2">
                    <Route size={16} className="text-brand-500" /> My Roadmap
                  </span>
                }
              />
              <div className="py-6 text-center">
                <p className="text-sm font-semibold text-ink">No Active Roadmap Yet</p>
                <p className="mt-1 text-xs text-ink-soft">
                  Select a government service or ask our AI Assistant to generate your step-by-step roadmap.
                </p>
                <div className="mt-4 flex justify-center gap-3">
                  <Link
                    to="/app/services"
                    className="focus-ring inline-flex items-center gap-1.5 rounded-xl bg-brand-500 px-4 py-2 text-xs font-medium text-white hover:bg-brand-600"
                  >
                    Browse Services <ArrowRight size={13} />
                  </Link>
                  <Link
                    to="/app/assistant"
                    className="focus-ring inline-flex items-center gap-1.5 rounded-xl border border-line bg-surface px-4 py-2 text-xs font-medium text-ink hover:bg-canvas"
                  >
                    Ask AI Assistant
                  </Link>
                </div>
              </div>
            </Card>
          )}

          {/* My applications */}
          <Card>
            <CardHeader
              title="My Applications"
              action={
                <Link to="/app/tracker" className="text-sm font-medium text-brand-600">
                  {t('view_all')}
                </Link>
              }
            />
            <div className="divide-y divide-line">
              {applications.length === 0 && <p className="py-4 text-sm text-ink-soft">No applications yet.</p>}
              {applications.map((app) => {
                const service = findServiceById(app.serviceId)
                if (!service) return null
                return (
                  <div key={app.id} className="flex flex-wrap items-center gap-3 py-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                      <FileCheck2 size={16} />
                    </span>
                    <div className="min-w-[140px] flex-1">
                      <p className="text-sm font-medium text-ink">{tb(service.name)}</p>
                      <p className="text-xs text-ink-soft">Started {app.dateStarted}</p>
                    </div>
                    <Badge tone={statusTone[app.status]}>{statusLabel[app.status]}</Badge>
                    <Link to={`/app/tracker`} className="text-sm font-medium text-brand-600">
                      {app.status === 'completed' ? t('view_details') : t('track_now')}
                    </Link>
                  </div>
                )
              })}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Profile completion */}
          {user && (
            <Card>
              <CardHeader title="My Profile" action={<Link to="/app/profile" className="text-sm font-medium text-brand-600">{t('view_all')}</Link>} />
              <div className="mb-4 flex items-center gap-4">
                <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-lg font-bold text-brand-600">
                  {user.profileCompletion}%
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink">Profile Complete</p>
                  <p className="text-xs text-ink-soft">Finish setup for personalized guidance.</p>
                </div>
              </div>
              <div className="space-y-2">
                {user.verifications.map((v) => (
                  <div key={v.label} className="flex items-center gap-2 text-sm">
                    <BadgeCheck size={16} className={v.verified ? 'text-good-500' : 'text-line'} />
                    <span className={v.verified ? 'text-ink' : 'text-ink-soft'}>{v.label}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Upcoming tasks */}
          <Card>
            <CardHeader title="Upcoming Tasks" />
            <div className="space-y-3">
              {applications.filter((a) => a.status !== 'completed').length === 0 ? (
                <p className="py-2 text-sm text-ink-soft">No upcoming tasks.</p>
              ) : (
                applications
                  .filter((a) => a.status !== 'completed')
                  .map((app) => {
                    const s = findServiceById(app.serviceId)
                    const step = s?.steps[app.currentStepIndex]
                    return (
                      <div key={app.id} className="flex items-start gap-2.5">
                        <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-canvas text-ink-soft">
                          <BellRing size={14} />
                        </span>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-ink">{s ? tb(s.name) : 'Application'}</p>
                          <p className="text-xs text-ink-soft">Step {app.currentStepIndex + 1}: {step ? tb(step.title) : 'In progress'}</p>
                        </div>
                        <Badge tone="warn">Pending</Badge>
                      </div>
                    )
                  })
              )}
            </div>
          </Card>

          {/* Find services */}
          <Card>
            <CardHeader title="Find Services" action={<Link to="/app/services" className="text-sm font-medium text-brand-600">{t('view_all')}</Link>} />
            <div className="grid grid-cols-2 gap-2">
              {services.slice(0, 6).map((s) => (
                <Link
                  key={s.id}
                  to={`/app/services/${s.id}`}
                  className="focus-ring flex items-center justify-between rounded-xl border border-line px-3 py-2.5 text-xs font-medium text-ink hover:bg-canvas"
                >
                  {s.shortName}
                  <ArrowRight size={12} className="text-ink-soft" />
                </Link>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Trust strip */}
      <Card className="grid gap-4 sm:grid-cols-4">
        {[
          { icon: ShieldCheck, title: t('trust_secure'), sub: t('trust_secure_sub') },
          { icon: BadgeCheck, title: t('trust_verified'), sub: t('trust_verified_sub') },
          { icon: Route, title: t('trust_guidance'), sub: t('trust_guidance_sub') },
          { icon: BellRing, title: t('trust_tracking'), sub: t('trust_tracking_sub') },
        ].map(({ icon: Icon, title, sub }) => (
          <div key={title} className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-100 text-teal-600">
              <Icon size={16} />
            </span>
            <div>
              <p className="text-sm font-semibold text-ink">{title}</p>
              <p className="text-xs text-ink-soft">{sub}</p>
            </div>
          </div>
        ))}
      </Card>
    </div>
  )
}
