import { certificateOfGoodStanding } from '../order-types/certificate-of-good-standing'
import { genericOrder } from '../order-types/generic-order'
import type { OrderTypeDefinition } from './types'

const orderTypes = new Map<string, OrderTypeDefinition>()

export function registerOrderType(definition: OrderTypeDefinition): void {
  if (definition.sections.at(-1)?.sectionKey !== 'REVIEW_AND_PLACE') {
    throw new Error(`${definition.key} must terminate with REVIEW_AND_PLACE`)
  }
  orderTypes.set(definition.key, definition)
}

registerOrderType(genericOrder)
registerOrderType(certificateOfGoodStanding)

export function getOrderType(key: string): OrderTypeDefinition {
  const definition = orderTypes.get(key)
  if (!definition) {
    throw new Error(`Unknown order type: ${key}`)
  }
  return definition
}

export function listOrderTypes(): OrderTypeDefinition[] {
  return [...orderTypes.values()]
}

export function listCategories(): string[] {
  return [...new Set(listOrderTypes().map((definition) => definition.category))]
}
