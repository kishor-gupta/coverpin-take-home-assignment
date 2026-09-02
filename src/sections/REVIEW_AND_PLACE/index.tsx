import { asString } from '../fields/asFile'
import { SummaryRow } from '../fields/SummaryRow'
import { TextArea } from '../fields/TextArea'
import { TextInput } from '../fields/TextInput'
import type { SectionModule, SectionProps, SectionSummaryProps } from '../types'

function Form({ values, errors, handlers, fields, state }: SectionProps) {
  const text = fields.text
  const description = fields.description
  return (
    <div className="flex flex-col gap-4">
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
      {description ? (
        <TextArea
          id={description.key}
          label={description.label}
          value={asString(values[description.key])}
          onChange={(value) => handlers.onChange(description.key, value)}
          error={errors[description.key]}
          placeholder={description.placeholder}
          helpText={description.helpText}
          disabled={state.disabled}
        />
      ) : null}
      {handlers.onPlaceOrder && !state.disabled ? (
        <button
          type="button"
          onClick={handlers.onPlaceOrder}
          disabled={state.placing}
          className="self-start rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {state.placing ? 'Placing…' : 'Place order'}
        </button>
      ) : null}
    </div>
  )
}

function Summary({ values, fields, title }: SectionSummaryProps) {
  const text = fields.text
  const description = fields.description
  return (
    <section>
      <h3 className="mb-2 text-sm font-semibold text-stone-900">{title}</h3>
      <dl>
        {text ? <SummaryRow label={text.label} value={asString(values[text.key])} /> : null}
        {description ? (
          <SummaryRow label={description.label} value={asString(values[description.key])} />
        ) : null}
      </dl>
    </section>
  )
}

export const reviewAndPlaceSection: SectionModule = { Form, Summary }
