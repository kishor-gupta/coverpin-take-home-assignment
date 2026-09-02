interface SummaryRowProps {
  label: string
  value: string
}

export function SummaryRow({ label, value }: SummaryRowProps) {
  return (
    <div className="grid gap-1 border-b border-stone-100 py-2 last:border-0 sm:grid-cols-[12rem_1fr]">
      <dt className="text-xs font-medium uppercase tracking-wide text-stone-500">{label}</dt>
      <dd className="text-sm text-stone-900 whitespace-pre-wrap">{value || '—'}</dd>
    </div>
  )
}
