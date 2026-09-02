interface EmptyStateProps {
  title: string
  body: string
}

export function EmptyState({ title, body }: EmptyStateProps) {
  return (
    <div className="rounded-lg border border-dashed border-stone-300 bg-white px-6 py-12 text-center">
      <h2 className="text-base font-semibold text-stone-900">{title}</h2>
      <p className="mt-2 text-sm text-stone-600">{body}</p>
    </div>
  )
}
