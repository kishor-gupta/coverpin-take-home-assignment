import { asFile, asString } from '../fields/asFile'
import { FileUpload } from '../fields/FileUpload'
import { SummaryRow } from '../fields/SummaryRow'
import { TextArea } from '../fields/TextArea'
import type { SectionModule, SectionProps, SectionSummaryProps } from '../types'

function Form({ values, errors, handlers, fields, state }: SectionProps) {
  const description = fields.description
  const file = fields.file
  return (
    <div className="flex flex-col gap-4">
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
  const description = fields.description
  const file = fields.file
  return (
    <section>
      <h3 className="mb-2 text-sm font-semibold text-stone-900">{title}</h3>
      <dl>
        {description ? (
          <SummaryRow label={description.label} value={asString(values[description.key])} />
        ) : null}
        {file ? <SummaryRow label={file.label} value={asFile(values[file.key])?.name ?? ''} /> : null}
      </dl>
    </section>
  )
}

export const descriptionAndFileSection: SectionModule = { Form, Summary }
