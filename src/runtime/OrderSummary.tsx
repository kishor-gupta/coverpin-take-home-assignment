import { getSection } from '../registry/sections'
import type { OrderTypeDefinition } from '../registry/types'
import { REVIEW_AND_PLACE } from '../sections/keys'
import { asSectionValues } from './sectionValues'

export function summarySections(definition: OrderTypeDefinition) {
  return definition.sections.filter((section) => section.sectionKey !== REVIEW_AND_PLACE)
}

interface OrderSummaryProps {
  definition: OrderTypeDefinition
  values: Record<string, unknown>
  includeReviewFields?: boolean
}

export function OrderSummary({
  definition,
  values,
  includeReviewFields = false,
}: OrderSummaryProps) {
  const sections = includeReviewFields ? definition.sections : summarySections(definition)

  return (
    <div className="flex flex-col gap-6">
      {sections.map((section) => {
        const module = getSection(section.sectionKey)
        return (
          <module.Summary
            key={section.key}
            title={section.title}
            fields={section.fields}
            values={asSectionValues(values, section.key)}
          />
        )
      })}
    </div>
  )
}
