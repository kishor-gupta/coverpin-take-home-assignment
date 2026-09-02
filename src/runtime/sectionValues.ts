export function asSectionValues(values: Record<string, unknown>, sectionKey: string): Record<string, unknown> {
  const current = values[sectionKey]
  if (current && typeof current === 'object' && !Array.isArray(current)) {
    return current as Record<string, unknown>
  }
  return {}
}

export function setSectionField(
  values: Record<string, unknown>,
  sectionKey: string,
  fieldKey: string,
  value: unknown,
): Record<string, unknown> {
  return {
    ...values,
    [sectionKey]: {
      ...asSectionValues(values, sectionKey),
      [fieldKey]: value,
    },
  }
}
