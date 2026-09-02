import { getSection } from '../registry/sections'
import type { SectionDefinition, SectionHandlers, SectionState } from '../sections/types'

interface SectionRendererProps {
  section: SectionDefinition
  values: Record<string, unknown>
  errors: Record<string, string>
  handlers: SectionHandlers
  state: SectionState
}

export function SectionRenderer({
  section,
  values,
  errors,
  handlers,
  state,
}: SectionRendererProps) {
  const module = getSection(section.sectionKey)
  return (
    <module.Form
      values={values}
      errors={errors}
      handlers={handlers}
      fields={section.fields}
      state={state}
    />
  )
}
