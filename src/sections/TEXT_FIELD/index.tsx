import { asString } from '../fields/asFile'
import { SummaryRow } from '../fields/SummaryRow'
import { TextInput } from '../fields/TextInput'
import type { SectionModule, SectionProps, SectionSummaryProps } from '../types'

function Form({ values, errors, handlers, fields, state }: SectionProps) {
  const field = fields.text
  if (!field) return null
  return (
    <TextInput
      id={field.key}
      label={field.label}
      value={asString(values[field.key])}
      onChange={(value) => handlers.onChange(field.key, value)}
      error={errors[field.key]}
      placeholder={field.placeholder}
      helpText={field.helpText}
      disabled={state.disabled}
    />
  )
}

function Summary({ values, fields, title }: SectionSummaryProps) {
  const field = fields.text
  return (
    <section>
      <h3 className="mb-2 text-sm font-semibold text-stone-900">{title}</h3>
      <dl>
        <SummaryRow label={field?.label ?? 'Value'} value={asString(field ? values[field.key] : '')} />
      </dl>
    </section>
  )
}

export const textFieldSection: SectionModule = { Form, Summary }
