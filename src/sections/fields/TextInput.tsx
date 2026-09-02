interface TextInputProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
  placeholder?: string
  helpText?: string
  disabled?: boolean
}

export function TextInput({
  id,
  label,
  value,
  onChange,
  error,
  placeholder,
  helpText,
  disabled,
}: TextInputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-stone-800">
        {label}
      </label>
      <input
        id={id}
        type="text"
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={Boolean(error)}
        className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 outline-none focus:border-stone-700 disabled:bg-stone-100"
      />
      {helpText ? <p className="text-xs text-stone-500">{helpText}</p> : null}
      {error ? <p className="text-xs text-red-700">{error}</p> : null}
    </div>
  )
}
