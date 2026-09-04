export function ProgressBar({ value, className = '' }: { value: number; className?: string }) {
  const clamped = Math.max(0, Math.min(100, value))
  return (
    <div className={`h-2 w-full overflow-hidden rounded-full bg-canvas ${className}`}>
      <div
        className="h-full rounded-full bg-gradient-to-r from-brand-400 to-teal-400 transition-[width]"
        style={{ width: `${clamped}%` }}
      />
    </div>
  )
}
