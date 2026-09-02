import type { ZodType } from 'zod'
import type { SectionDefinition } from '../sections/types'

export interface OrderTypeDefinition {
  key: string
  label: string
  category: string
  description: string
  sections: SectionDefinition[]
  schema: ZodType
  defaults: Record<string, unknown>
  toSubmission: (values: Record<string, unknown>) => Record<string, unknown>
}
