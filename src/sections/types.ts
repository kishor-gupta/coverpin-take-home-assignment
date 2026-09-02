import type { ComponentType } from 'react'

export interface FieldOption {
  value: string
  label: string
}

export interface FieldConfig {
  key: string
  label: string
  placeholder?: string
  helpText?: string
  options?: FieldOption[]
}

export interface SectionDefinition {
  key: string
  sectionKey: string
  title: string
  description?: string
  fields: Record<string, FieldConfig>
}

export interface SectionState {
  disabled: boolean
  placing?: boolean
}

export interface SectionHandlers {
  onChange: (fieldKey: string, value: unknown) => void
  onPlaceOrder?: () => void
}

export interface SectionProps {
  values: Record<string, unknown>
  errors: Record<string, string>
  handlers: SectionHandlers
  fields: Record<string, FieldConfig>
  state: SectionState
}

export interface SectionSummaryProps {
  values: Record<string, unknown>
  fields: Record<string, FieldConfig>
  title: string
}

export interface SectionModule {
  Form: ComponentType<SectionProps>
  Summary: ComponentType<SectionSummaryProps>
}
