import type { ZodError } from 'zod'
import type { OrderTypeDefinition } from '../registry/types'

export interface ValidationResult {
  ok: boolean
  errors: Record<string, string>
}

export function flattenZodError(error: ZodError): Record<string, string> {
  const out: Record<string, string> = {}
  for (const issue of error.issues) {
    const key = issue.path.map(String).join('.')
    if (key && out[key] === undefined) {
      out[key] = issue.message
    }
  }
  return out
}

export function validateOrder(
  definition: OrderTypeDefinition,
  values: Record<string, unknown>,
): ValidationResult {
  const parsed = definition.schema.safeParse(values)
  if (parsed.success) {
    return { ok: true, errors: {} }
  }
  return { ok: false, errors: flattenZodError(parsed.error) }
}

export function errorsForSection(
  errors: Record<string, string>,
  sectionInstanceKey: string,
): Record<string, string> {
  const prefix = `${sectionInstanceKey}.`
  const scoped: Record<string, string> = {}
  for (const [path, message] of Object.entries(errors)) {
    if (path.startsWith(prefix)) {
      scoped[path.slice(prefix.length)] = message
    } else if (path === sectionInstanceKey) {
      scoped._section = message
    }
  }
  return scoped
}

export function firstSectionWithErrors(
  definition: OrderTypeDefinition,
  errors: Record<string, string>,
): string | null {
  for (const section of definition.sections) {
    if (Object.keys(errorsForSection(errors, section.key)).length > 0) {
      return section.key
    }
  }
  return null
}
