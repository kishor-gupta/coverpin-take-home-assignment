import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import type { OrderTypeDefinition } from '../registry/types'
import { REVIEW_AND_PLACE, SECTION_KEYS } from '../sections/keys'
import { summarySections } from './OrderSummary'
import { errorsForSection, firstSectionWithErrors, validateOrder } from './validation'

function inventedType(): OrderTypeDefinition {
  return {
    key: 'INVENTED_FOR_TEST',
    label: 'Invented',
    category: 'Test',
    description: 'Proves review is schema-driven',
    sections: [
      {
        key: 'ALPHA',
        sectionKey: SECTION_KEYS.TEXT_FIELD,
        title: 'Alpha',
        fields: { text: { key: 'name', label: 'Name' } },
      },
      {
        key: REVIEW_AND_PLACE,
        sectionKey: REVIEW_AND_PLACE,
        title: 'Review',
        fields: {
          text: { key: 'who', label: 'Who' },
          description: { key: 'notes', label: 'Notes' },
        },
      },
    ],
    schema: z.object({
      ALPHA: z.object({ name: z.string().min(1, 'Enter a name') }),
      [REVIEW_AND_PLACE]: z.object({
        who: z.string().min(1),
        notes: z.string().min(1),
      }),
    }),
    defaults: {},
    toSubmission: (values) => values,
  }
}

describe('generic summary and validation runtime', () => {
  it('walks the type section list and never branches on type key', () => {
    expect(summarySections(inventedType()).map((section) => section.key)).toEqual(['ALPHA'])
  })

  it('scopes schema errors to the section that owns the field', () => {
    const definition = inventedType()
    const result = validateOrder(definition, {
      ALPHA: { name: '' },
      REVIEW_AND_PLACE: { who: 'Ada', notes: 'Ready' },
    })
    expect(result.ok).toBe(false)
    expect(errorsForSection(result.errors, 'ALPHA').name).toBeTruthy()
    expect(errorsForSection(result.errors, REVIEW_AND_PLACE)).toEqual({})
    expect(firstSectionWithErrors(definition, result.errors)).toBe('ALPHA')
  })
})
