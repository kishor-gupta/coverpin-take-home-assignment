import { z } from 'zod'
import type { OrderTypeDefinition } from '../../registry/types'
import { REVIEW_AND_PLACE, SECTION_KEYS } from '../../sections/keys'

const uploadedFile = z.object({
  name: z.string().min(1),
  size: z.number(),
  type: z.string(),
  dataUrl: z.string().min(1),
})

export const genericOrder: OrderTypeDefinition = {
  key: 'GENERIC_ORDER',
  label: 'Generic Order',
  category: 'General',
  description: 'A flexible request with a title, attachment, and narrative details.',
  sections: [
    {
      key: 'S1',
      sectionKey: SECTION_KEYS.TEXT_AND_FILE,
      title: 'Request details',
      description: 'Name the work and attach anything the fulfillment team should see.',
      fields: {
        text: {
          key: 'title',
          label: 'Request title',
          placeholder: 'Office relocation support',
        },
        file: {
          key: 'attachment',
          label: 'Supporting document',
          helpText: 'PDF or image, 1.5 MB or smaller.',
        },
      },
    },
    {
      key: 'S2',
      sectionKey: SECTION_KEYS.DESCRIPTION,
      title: 'Scope',
      fields: {
        description: {
          key: 'details',
          label: 'Description',
          placeholder: 'What should be delivered, and by when?',
        },
      },
    },
    {
      key: REVIEW_AND_PLACE,
      sectionKey: REVIEW_AND_PLACE,
      title: 'Review and place',
      description: 'Confirm the requestor and add any last notes before placing the order.',
      fields: {
        text: {
          key: 'requestorName',
          label: 'Requestor name',
          placeholder: 'Your name as it should appear on the order',
        },
        description: {
          key: 'fulfillmentNotes',
          label: 'Fulfillment notes',
          placeholder: 'Routing, urgency, or delivery constraints',
        },
      },
    },
  ],
  schema: z.object({
    S1: z.object({
      title: z.string().min(1, 'Enter a request title'),
      attachment: uploadedFile,
    }),
    S2: z.object({
      details: z.string().min(1, 'Describe the request'),
    }),
    [REVIEW_AND_PLACE]: z.object({
      requestorName: z.string().min(1, 'Enter the requestor name'),
      fulfillmentNotes: z.string().min(1, 'Add fulfillment notes'),
    }),
  }),
  defaults: {
    S1: { title: '', attachment: null },
    S2: { details: '' },
    [REVIEW_AND_PLACE]: { requestorName: '', fulfillmentNotes: '' },
  },
  toSubmission: (values) => ({
    type: 'GENERIC_ORDER',
    title: (values.S1 as { title?: string } | undefined)?.title ?? '',
    details: (values.S2 as { details?: string } | undefined)?.details ?? '',
  }),
}
