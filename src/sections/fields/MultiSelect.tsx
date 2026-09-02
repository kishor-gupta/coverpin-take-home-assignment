import type { FieldOption } from '../types'

interface MultiSelectProps {
  legend: string
  options: FieldOption[]
  value: string[]
  onChange: (value: string[]) => void
  error?: string
  helpText?: string
  disabled?: boolean
}

export function MultiSelect({
  legend,
  options,
  value,
  onChange,
  error,
  helpText,
  disabled,
}: MultiSelectProps) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="text-sm font-medium text-stone-800">{legend}</legend>
      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((option) => {
          const checked = value.includes(option.value)
          return (
            <label
              key={option.value}
              className="flex items-center gap-2 rounded-md border border-stone-200 bg-white px-3 py-2 text-sm"
            >
              <input
                type="checkbox"
                disabled={disabled}
                checked={checked}
                onChange={() => {
                  onChange(
                    checked
                      ? value.filter((item) => item !== option.value)
                      : [...value, option.value],
                  )
                }}
              />
              {option.label}
            </label>
          )
        })}
      </div>
      {helpText ? <p className="text-xs text-stone-500">{helpText}</p> : null}
      {error ? <p className="text-xs text-red-700">{error}</p> : null}
    </fieldset>
  )
}
