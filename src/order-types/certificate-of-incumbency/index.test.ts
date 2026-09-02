import { describe, expect, it } from 'vitest'
import { getOrderType } from '../../registry/orderTypes'
import { summarySections } from '../../runtime/OrderSummary'
import { REVIEW_AND_PLACE, SECTION_KEYS } from '../../sections/keys'

describe('Certificate of Incumbency', () => {
  it('reuses existing sections and needs no review-component changes', () => {
    const type = getOrderType('CERTIFICATE_OF_INCUMBENCY')
    expect(summarySections(type).map((section) => section.sectionKey)).toEqual([
      SECTION_KEYS.TEXT_AND_FILE,
      SECTION_KEYS.DESCRIPTION,
      SECTION_KEYS.TEXT_AND_FILE,
      SECTION_KEYS.DESCRIPTION,
    ])
    expect(type.sections.at(-1)?.sectionKey).toBe(REVIEW_AND_PLACE)
  })
})
