import type { Order } from '../types/order'

export const ORDERS_STORAGE_KEY = 'coverpin.orders.v1'

export function loadAllOrders(): Order[] {
  const raw = localStorage.getItem(ORDERS_STORAGE_KEY)
  if (!raw) return []
  try {
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as Order[]) : []
  } catch {
    return []
  }
}

export function saveAllOrders(orders: Order[]): void {
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders))
}
