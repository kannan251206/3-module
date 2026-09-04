import { Link } from 'react-router-dom'
import { Sparkles, ArrowRight, MessageSquareText, ScanLine, Map, BellRing } from 'lucide-react'

const oldWay = ['Search', 'Find a portal', 'Understand the procedure', 'Collect documents', 'Apply', 'Track']
const newWay = ['Explain your problem in plain language', 'AI understands', 'Personalized roadmap', 'Document check', 'Official portal', 'Track']

export function LandingPage() {
  return (
    <div className="min-h-screen bg-canvas">
      <header className="flex items-center justify-between px-6 py-5 sm:px-10">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-teal-400 text-white">
            <Sparkles size={18} />
          </span>
          <span className="font-display text-sm font-bold">
            <span className="text-brand-600">AI Bureaucracy</span> <span className="text-ink">Navigator</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="focus-ring rounded-xl px-3 py-2 text-sm font-medium text-ink-soft hover:text-ink">
            Log in
          </Link>
          <Link
            to="/register"
            className="focus-ring rounded-xl bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
          >
            Get started
          </Link>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl gap-10 px-6 pb-16 pt-8 sm:px-10 lg:grid-cols-2 lg:items-center">
        <div>
          <h1 className="font-display text-4xl font-extrabold leading-tight text-ink sm:text-5xl">
            Government services, made simple.
          </h1>
          <p className="mt-4 max-w-md text-base text-ink-soft">
            Tell us what you need. AI guides you through the process, checks your documents, and takes you to the
            right official portal.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              to="/register"
              className="focus-ring inline-flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-600"
            >
              Start a Service <ArrowRight size={16} />
            </Link>
            <Link
              to="/login"
              className="focus-ring inline-flex items-center gap-2 rounded-xl border border-line bg-surface px-5 py-3 text-sm font-semibold text-ink hover:bg-canvas"
            >
              Explore Services
            </Link>
          </div>
        </div>

        <div className="rounded-3xl border border-line bg-surface p-6 shadow-sm">
          <p className="mb-4 flex items-center gap-2 text-sm font-semibold text-ink">
            <MessageSquareText size={16} className="text-brand-500" /> Bureaucracy AI Assistant
          </p>
          <div className="space-y-3 text-sm">
            <div className="ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-brand-500 px-4 py-2.5 text-white">
              I want to apply for a PAN card.
            </div>
            <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-canvas px-4 py-2.5 text-ink">
              Sure — here's who can apply, the documents you need, and a step-by-step roadmap to the official portal.
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16 sm:px-10">
        <h2 className="mb-6 text-center font-display text-2xl font-bold text-ink">Why this is different</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-line bg-surface p-6">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-soft">Existing government websites</p>
            <ol className="space-y-2 text-sm text-ink-soft">
              {oldWay.map((step, i) => (
                <li key={step} className="flex items-center gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-canvas text-[11px] text-ink-soft">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
          <div className="rounded-2xl border border-brand-200 bg-brand-50/60 p-6">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-brand-600">AI Bureaucracy Navigator</p>
            <ol className="space-y-2 text-sm text-ink">
              {newWay.map((step, i) => (
                <li key={step} className="flex items-center gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-500 text-[11px] text-white">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-sm text-ink-soft">
          The platform acts as a navigation and assistance layer — not a replacement for official government
          portals.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20 sm:px-10">
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            { icon: ScanLine, title: 'Document check', body: 'Upload a document and see what\u2019s missing or low quality before you apply.' },
            { icon: Map, title: 'Personalized roadmap', body: 'A clear, ordered path from eligibility to receiving your document.' },
            { icon: BellRing, title: 'Application tracking', body: 'Follow status and get reminders for what to do next.' },
          ].map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-2xl border border-line bg-surface p-6">
              <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-teal-100 text-teal-600">
                <Icon size={18} />
              </span>
              <p className="mb-1 text-sm font-semibold text-ink">{title}</p>
              <p className="text-sm text-ink-soft">{body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
