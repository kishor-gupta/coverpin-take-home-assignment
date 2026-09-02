export const USER_IDS = ['alice', 'bob'] as const
export type UserId = (typeof USER_IDS)[number]

export interface User {
  id: UserId
  name: string
}

export type OrderStatus = 'draft' | 'submitted'

export interface UploadedFile {
  name: string
  size: number
  type: string
  dataUrl: string
}

export interface Order {
  id: string
  typeKey: string
  creatorId: UserId
  status: OrderStatus
  values: Record<string, unknown>
  createdAt: string
  updatedAt: string
  submittedAt?: string
  submission?: Record<string, unknown>
}

export const ORDER_STATUSES = ['draft', 'submitted'] as const
