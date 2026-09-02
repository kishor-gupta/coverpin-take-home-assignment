import { getOrderType } from '../registry/orderTypes'
import { loadAllOrders, saveAllOrders } from '../persistence/storage'
import { validateOrder } from '../runtime/validation'
import type { Order, UserId } from '../types/order'
import { AccessDeniedError, NotFoundError, ValidationError } from './errors'
import { assertDelete, assertRead, assertSubmit, assertUpdate, canRead } from './permissions'

function write(orders: Order[]): void {
  saveAllOrders(orders)
}

function now(): string {
  return new Date().toISOString()
}

function findOrder(id: string): Order | undefined {
  return loadAllOrders().find((order) => order.id === id)
}

export function listOrders(actor: UserId): Order[] {
  return loadAllOrders()
    .filter((order) => canRead(actor, order))
    .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))
}

export function getOrder(actor: UserId, id: string): Order | null {
  const order = findOrder(id)
  if (!order) return null
  try {
    assertRead(actor, order)
    return order
  } catch (error) {
    if (error instanceof AccessDeniedError) return null
    throw error
  }
}

export function createDraft(actor: UserId, typeKey: string): Order {
  const definition = getOrderType(typeKey)
  const createdAt = now()
  const order: Order = {
    id: crypto.randomUUID(),
    typeKey: definition.key,
    creatorId: actor,
    status: 'draft',
    values: structuredClone(definition.defaults),
    createdAt,
    updatedAt: createdAt,
  }
  write([...loadAllOrders(), order])
  return order
}

export function saveDraft(
  actor: UserId,
  id: string,
  values: Record<string, unknown>,
): Order {
  const orders = loadAllOrders()
  const index = orders.findIndex((order) => order.id === id)
  if (index < 0) throw new NotFoundError()
  const current = orders[index]
  assertUpdate(actor, current)
  const next: Order = {
    ...current,
    values: structuredClone(values),
    updatedAt: now(),
  }
  orders[index] = next
  write(orders)
  return next
}

export function deleteDraft(actor: UserId, id: string): void {
  const orders = loadAllOrders()
  const current = orders.find((order) => order.id === id)
  if (!current) throw new NotFoundError()
  assertDelete(actor, current)
  write(orders.filter((order) => order.id !== id))
}

export function submitOrder(actor: UserId, id: string): Order {
  const orders = loadAllOrders()
  const index = orders.findIndex((order) => order.id === id)
  if (index < 0) throw new NotFoundError()
  const current = orders[index]
  assertSubmit(actor, current)
  const definition = getOrderType(current.typeKey)
  const validation = validateOrder(definition, current.values)
  if (!validation.ok) {
    throw new ValidationError(validation.errors)
  }
  const submittedAt = now()
  const next: Order = {
    ...current,
    status: 'submitted',
    submittedAt,
    updatedAt: submittedAt,
    submission: definition.toSubmission(current.values),
  }
  orders[index] = next
  write(orders)
  return next
}
