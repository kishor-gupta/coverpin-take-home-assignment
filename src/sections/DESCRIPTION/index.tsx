import { asString } from '../fields/asFile'
import { SummaryRow } from '../fields/SummaryRow'
import { TextArea } from '../fields/TextArea'
import type { SectionModule, SectionProps, SectionSummaryProps } from '../types'

function Form({ values, errors, handlers, fields, state }: SectionProps) {
  const field = fields.description
  if (!field) return null
  return (
    <TextArea
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
  const field = fields.description
  return (
    <section>
      <h3 className="mb-2 text-sm font-semibold text-stone-900">{title}</h3>
      <dl>
        <SummaryRow
          label={field?.label ?? 'Description'}
          value={asString(field ? values[field.key] : '')}
        />
      </dl>
    </section>
  )
}

export const descriptionSection: SectionModule = { Form, Summary }
