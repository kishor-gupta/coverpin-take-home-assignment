import type { UploadedFile } from '../../types/order'

export function asString(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

export function asStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : []
}

export function asFile(value: unknown): UploadedFile | null {
  if (!value || typeof value !== 'object') return null
  const record = value as Record<string, unknown>
  if (typeof record.name !== 'string' || typeof record.dataUrl !== 'string') return null
  return {
    name: record.name,
    size: typeof record.size === 'number' ? record.size : 0,
    type: typeof record.type === 'string' ? record.type : '',
    dataUrl: record.dataUrl,
  }
}
