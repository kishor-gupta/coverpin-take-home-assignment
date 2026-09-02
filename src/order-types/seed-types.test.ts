import { describe, expect, it } from 'vitest'
import { getOrderType, listOrderTypes } from '../registry/orderTypes'
import { REVIEW_AND_PLACE } from '../sections/keys'
import { summarySections } from '../runtime/OrderSummary'

describe('seed order types', () => {
  it('registers both seed types without a type switch', () => {
    const keys = listOrderTypes().map((type) => type.key)
    expect(keys).toContain('GENERIC_ORDER')
    expect(keys).toContain('CERTIFICATE_OF_GOOD_STANDING')
  })

  it('builds review summaries from each type section list', () => {
    const generic = getOrderType('GENERIC_ORDER')
    const standing = getOrderType('CERTIFICATE_OF_GOOD_STANDING')
    expect(summarySections(generic).map((section) => section.key)).toEqual(['S1', 'S2'])
    expect(summarySections(standing).map((section) => section.key)).toEqual(['S1', 'S2', 'S3'])
    expect(generic.sections.at(-1)?.sectionKey).toBe(REVIEW_AND_PLACE)
    expect(standing.sections.at(-1)?.sectionKey).toBe(REVIEW_AND_PLACE)
  })
})
