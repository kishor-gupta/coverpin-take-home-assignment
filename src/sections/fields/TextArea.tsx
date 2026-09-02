interface TextAreaProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
  placeholder?: string
  helpText?: string
  disabled?: boolean
  rows?: number
}

export function TextArea({
  id,
  label,
  value,
  onChange,
  error,
  placeholder,
  helpText,
  disabled,
  rows = 5,
}: TextAreaProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-stone-800">
        {label}
      </label>
      <textarea
        id={id}
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        rows={rows}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={Boolean(error)}
        className="w-full resize-y rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 outline-none focus:border-stone-700 disabled:bg-stone-100"
      />
      {helpText ? <p className="text-xs text-stone-500">{helpText}</p> : null}
      {error ? <p className="text-xs text-red-700">{error}</p> : null}
    </div>
  )
}
