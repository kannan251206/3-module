import { NavLink } from 'react-router-dom'
import {
  Sparkles,
  LayoutGrid,
  Bot,
  Map,
  FileText,
  Grid3x3,
  ClipboardList,
  BookOpen,
  User,
  LogOut,
  HelpCircle,
  HeadphonesIcon,
  Compass,
  Award,
  BookOpenCheck,
} from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { useAuth } from '@/context/AuthContext'

const navItems = [
  { to: '/app', icon: LayoutGrid, key: 'nav_dashboard', end: true },
  { to: '/app/assistant', icon: Bot, key: 'nav_assistant', end: false },
  { to: '/app/life-events', icon: Compass, key: 'nav_life_events', end: false },
  { to: '/app/schemes', icon: Award, key: 'nav_schemes', end: false },
  { to: '/app/knowledge', icon: BookOpenCheck, key: 'nav_knowledge', end: false },
  { to: '/app/roadmap', icon: Map, key: 'nav_roadmap', end: false },
  { to: '/app/documents', icon: FileText, key: 'nav_documents', end: false },
  { to: '/app/services', icon: Grid3x3, key: 'nav_services', end: false },
  { to: '/app/tracker', icon: ClipboardList, key: 'nav_tracker', end: false },
  { to: '/app/help', icon: BookOpen, key: 'nav_help', end: false },
] as const

export function Sidebar() {
  const { t } = useLanguage()
  const { logout } = useAuth()

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-line bg-surface lg:flex">
      <div className="flex items-center gap-2 px-6 py-6">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-teal-400 text-white">
          <Sparkles size={18} />
        </span>
        <div className="leading-tight">
          <p className="font-display text-sm font-bold text-brand-600">AI Bureaucracy</p>
          <p className="font-display text-sm font-bold text-ink">Navigator</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {navItems.map(({ to, icon: Icon, key, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `focus-ring flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive ? 'bg-brand-50 text-brand-600' : 'text-ink-soft hover:bg-canvas'
              }`
            }
          >
            <Icon size={18} />
            {t(key)}
          </NavLink>
        ))}
        <NavLink
          to="/app/profile"
          className={({ isActive }) =>
            `focus-ring flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
              isActive ? 'bg-brand-50 text-brand-600' : 'text-ink-soft hover:bg-canvas'
            }`
          }
        >
          <User size={18} />
          {t('nav_profile')}
        </NavLink>
        <button
          onClick={logout}
          className="focus-ring flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut size={18} />
          Log Out
        </button>
      </nav>

      <div className="m-3 rounded-2xl bg-canvas p-4">
        <p className="mb-1 flex items-center gap-1.5 text-sm font-semibold text-ink">
          <HelpCircle size={16} className="text-brand-500" /> Need help?
        </p>
        <p className="mb-3 text-xs text-ink-soft">Talk to our support team.</p>
        <button className="focus-ring flex w-full items-center justify-center gap-2 rounded-xl border border-line bg-surface px-3 py-2 text-xs font-medium text-ink hover:bg-canvas">
          <HeadphonesIcon size={14} /> Contact Support
        </button>
      </div>
    </aside>
  )
}
