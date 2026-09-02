import { asString, asStringArray } from '../fields/asFile'
import { MultiSelect } from '../fields/MultiSelect'
import { SummaryRow } from '../fields/SummaryRow'
import { TextInput } from '../fields/TextInput'
import type { SectionModule, SectionProps, SectionSummaryProps } from '../types'

function Form({ values, errors, handlers, fields, state }: SectionProps) {
  const multi = fields.multi
  const text = fields.text
  const selected = asStringArray(multi ? values[multi.key] : [])
  return (
    <div className="flex flex-col gap-4">
      {multi ? (
        <MultiSelect
          legend={multi.label}
          options={multi.options ?? []}
          value={selected}
          onChange={(value) => handlers.onChange(multi.key, value)}
          error={errors[multi.key]}
          helpText={multi.helpText}
          disabled={state.disabled}
        />
      ) : null}
      {text ? (
        <TextInput
          id={text.key}
          label={text.label}
          value={asString(values[text.key])}
          onChange={(value) => handlers.onChange(text.key, value)}
          error={errors[text.key]}
          placeholder={text.placeholder}
          helpText={text.helpText}
          disabled={state.disabled}
        />
      ) : null}
    </div>
  )
}

function Summary({ values, fields, title }: SectionSummaryProps) {
  const multi = fields.multi
  const text = fields.text
  const labels = new Map((multi?.options ?? []).map((option) => [option.value, option.label]))
  const selected = asStringArray(multi ? values[multi.key] : [])
    .map((value) => labels.get(value) ?? value)
    .join(', ')
  return (
    <section>
      <h3 className="mb-2 text-sm font-semibold text-stone-900">{title}</h3>
      <dl>
        {multi ? <SummaryRow label={multi.label} value={selected} /> : null}
        {text ? <SummaryRow label={text.label} value={asString(values[text.key])} /> : null}
      </dl>
    </section>
  )
}

export const multiSelectAndTextSection: SectionModule = { Form, Summary }
