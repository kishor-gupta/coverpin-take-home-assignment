import type { Order, UserId } from '../types/order'
import { AccessDeniedError } from './errors'

export function canRead(actor: UserId, order: Order): boolean {
  if (order.status === 'submitted') return true
  return order.creatorId === actor
}

export function canUpdate(actor: UserId, order: Order): boolean {
  return order.status === 'draft' && order.creatorId === actor
}

export function canDelete(actor: UserId, order: Order): boolean {
  return order.status === 'draft' && order.creatorId === actor
}

export function canSubmit(actor: UserId, order: Order): boolean {
  return order.status === 'draft' && order.creatorId === actor
}

export function assertRead(actor: UserId, order: Order): void {
  if (!canRead(actor, order)) {
    throw new AccessDeniedError('Drafts are visible only to their creator')
  }
}

export function assertUpdate(actor: UserId, order: Order): void {
  if (!canUpdate(actor, order)) {
    throw new AccessDeniedError('Only the creator can edit a draft')
  }
}

export function assertDelete(actor: UserId, order: Order): void {
  if (!canDelete(actor, order)) {
    throw new AccessDeniedError('Only the creator may delete a draft')
  }
}

export function assertSubmit(actor: UserId, order: Order): void {
  if (!canSubmit(actor, order)) {
    throw new AccessDeniedError('Only the creator can place this draft')
  }
}
