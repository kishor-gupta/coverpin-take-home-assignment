import { asFile, asString } from '../fields/asFile'
import { FileUpload } from '../fields/FileUpload'
import { SummaryRow } from '../fields/SummaryRow'
import { TextInput } from '../fields/TextInput'
import type { SectionModule, SectionProps, SectionSummaryProps } from '../types'

function Form({ values, errors, handlers, fields, state }: SectionProps) {
  const text = fields.text
  const file = fields.file
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
      {file ? (
        <FileUpload
          id={file.key}
          label={file.label}
          value={asFile(values[file.key])}
          onChange={(value) => handlers.onChange(file.key, value)}
          error={errors[file.key]}
          helpText={file.helpText}
          disabled={state.disabled}
        />
      ) : null}
    </div>
  )
}

function Summary({ values, fields, title }: SectionSummaryProps) {
  const text = fields.text
  const file = fields.file
  return (
    <section>
      <h3 className="mb-2 text-sm font-semibold text-stone-900">{title}</h3>
      <dl>
        {text ? <SummaryRow label={text.label} value={asString(values[text.key])} /> : null}
        {file ? <SummaryRow label={file.label} value={asFile(values[file.key])?.name ?? ''} /> : null}
      </dl>
    </section>
  )
}

export const textAndFileSection: SectionModule = { Form, Summary }
