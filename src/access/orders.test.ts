import { beforeEach, describe, expect, it } from 'vitest'
import { registerOrderType } from '../registry/orderTypes'
import { REVIEW_AND_PLACE, SECTION_KEYS } from '../sections/keys'
import type { OrderTypeDefinition } from '../registry/types'
import { z } from 'zod'
import { AccessDeniedError, NotFoundError, ValidationError } from './errors'
import {
  createDraft,
  deleteDraft,
  getOrder,
  listOrders,
  saveDraft,
  submitOrder,
} from './orders'

const fixtureType: OrderTypeDefinition = {
  key: 'ACCESS_TEST_ORDER',
  label: 'Access test order',
  category: 'Test',
  description: 'Registered only for access-module tests',
  sections: [
    {
      key: 'S1',
      sectionKey: SECTION_KEYS.TEXT_FIELD,
      title: 'Title',
      fields: { text: { key: 'title', label: 'Title' } },
    },
    {
      key: REVIEW_AND_PLACE,
      sectionKey: REVIEW_AND_PLACE,
      title: 'Review',
      fields: {
        text: { key: 'name', label: 'Name' },
        description: { key: 'notes', label: 'Notes' },
      },
    },
  ],
  schema: z.object({
    S1: z.object({ title: z.string().min(1, 'Enter a title') }),
    [REVIEW_AND_PLACE]: z.object({
      name: z.string().min(1, 'Enter a name'),
      notes: z.string().min(1, 'Enter notes'),
    }),
  }),
  defaults: {
    S1: { title: '' },
    [REVIEW_AND_PLACE]: { name: '', notes: '' },
  },
  toSubmission: (values) => ({ title: (values.S1 as { title?: string }).title }),
}

registerOrderType(fixtureType)

function completeValues(): Record<string, unknown> {
  return {
    S1: { title: 'Desk move' },
    REVIEW_AND_PLACE: { name: 'Alice Chen', notes: 'Week of the 12th' },
  }
}

describe('access module', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('hides drafts from every user except the creator', () => {
    const draft = createDraft('kg', fixtureType.key)
    expect(listOrders('kg').map((order) => order.id)).toContain(draft.id)
    expect(listOrders('sm')).toEqual([])
    expect(getOrder('sm', draft.id)).toBeNull()
  })

  it('rejects draft mutation and delete from non-creators', () => {
    const draft = createDraft('kg', fixtureType.key)
    expect(() => saveDraft('sm', draft.id, draft.values)).toThrow(AccessDeniedError)
    expect(() => deleteDraft('sm', draft.id)).toThrow(AccessDeniedError)
    expect(() => submitOrder('sm', draft.id)).toThrow(AccessDeniedError)
    expect(getOrder('kg', draft.id)?.status).toBe('draft')
  })

  it('lets the creator delete a draft and nobody else afterwards', () => {
    const draft = createDraft('kg', fixtureType.key)
    deleteDraft('kg', draft.id)
    expect(getOrder('kg', draft.id)).toBeNull()
    expect(() => deleteDraft('kg', draft.id)).toThrow(NotFoundError)
  })

  it('exposes submitted orders to all users without allowing edits', () => {
    const draft = createDraft('kg', fixtureType.key)
    saveDraft('kg', draft.id, completeValues())
    const submitted = submitOrder('kg', draft.id)
    expect(submitted.status).toBe('submitted')
    expect(listOrders('sm').map((order) => order.id)).toContain(draft.id)
    expect(getOrder('sm', draft.id)?.status).toBe('submitted')
    expect(() => saveDraft('sm', draft.id, completeValues())).toThrow(AccessDeniedError)
    expect(() => deleteDraft('kg', draft.id)).toThrow(AccessDeniedError)
    expect(() => deleteDraft('sm', draft.id)).toThrow(AccessDeniedError)
  })
})

describe('save vs submit validation', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('persists invalid drafts and refuses incomplete submit', () => {
    const draft = createDraft('kg', fixtureType.key)
    const saved = saveDraft('kg', draft.id, {
      S1: { title: '' },
      REVIEW_AND_PLACE: { name: '', notes: '' },
    })
    expect(saved.status).toBe('draft')
    expect((saved.values.S1 as { title: string }).title).toBe('')
    expect(() => submitOrder('kg', draft.id)).toThrow(ValidationError)
    expect(getOrder('kg', draft.id)?.status).toBe('draft')
  })

  it('places an order only after the full type schema passes', () => {
    const draft = createDraft('kg', fixtureType.key)
    saveDraft('kg', draft.id, completeValues())
    const submitted = submitOrder('kg', draft.id)
    expect(submitted.status).toBe('submitted')
    expect(submitted.submission?.title).toBe('Desk move')
  })
})
