import { z } from 'zod'
import type { OrderTypeDefinition } from '../../registry/types'
import { REVIEW_AND_PLACE, SECTION_KEYS } from '../../sections/keys'

const uploadedFile = z.object({
  name: z.string().min(1),
  size: z.number(),
  type: z.string(),
  dataUrl: z.string().min(1),
})

export const certificateOfGoodStanding: OrderTypeDefinition = {
  key: 'CERTIFICATE_OF_GOOD_STANDING',
  label: 'Certificate of Good Standing',
  category: 'Corporate records',
  description:
    'Request a certificate confirming an entity is authorized and in good standing.',
  sections: [
    {
      key: 'S1',
      sectionKey: SECTION_KEYS.TEXT_FIELD,
      title: 'Entity',
      fields: {
        text: {
          key: 'entityName',
          label: 'Legal entity name',
          placeholder: 'Acme Holdings LLC',
        },
      },
    },
    {
      key: 'S2',
      sectionKey: SECTION_KEYS.MULTI_SELECT_AND_TEXT,
      title: 'Jurisdictions',
      fields: {
        multi: {
          key: 'jurisdictions',
          label: 'Jurisdictions',
          options: [
            { value: 'DE', label: 'Delaware' },
            { value: 'CA', label: 'California' },
            { value: 'NY', label: 'New York' },
            { value: 'TX', label: 'Texas' },
            { value: 'NV', label: 'Nevada' },
          ],
        },
        text: {
          key: 'specialInstructions',
          label: 'Special instructions',
          placeholder: 'Apostille, certified copies, or rush handling',
        },
      },
    },
    {
      key: 'S3',
      sectionKey: SECTION_KEYS.DESCRIPTION_AND_FILE,
      title: 'Purpose and evidence',
      fields: {
        description: {
          key: 'purpose',
          label: 'Purpose of the certificate',
          placeholder: 'Banking, licensing, or a financing close',
        },
        file: {
          key: 'supportingDocument',
          label: 'Supporting document',
          helpText: 'Formation document or a prior certificate. 1.5 MB or smaller.',
        },
      },
    },
    {
      key: REVIEW_AND_PLACE,
      sectionKey: REVIEW_AND_PLACE,
      title: 'Review and place',
      fields: {
        text: {
          key: 'authorizedSignatory',
          label: 'Authorized signatory',
          placeholder: 'Name of the person authorizing this request',
        },
        description: {
          key: 'deliveryInstructions',
          label: 'Delivery instructions',
          placeholder: 'Where the certificate should be sent',
        },
      },
    },
  ],
  schema: z.object({
    S1: z.object({
      entityName: z.string().min(1, 'Enter the legal entity name'),
    }),
    S2: z.object({
      jurisdictions: z.array(z.string()).min(1, 'Select at least one jurisdiction'),
      specialInstructions: z.string().min(1, 'Add special instructions'),
    }),
    S3: z.object({
      purpose: z.string().min(1, 'Describe the purpose'),
      supportingDocument: uploadedFile,
    }),
    [REVIEW_AND_PLACE]: z.object({
      authorizedSignatory: z.string().min(1, 'Enter the authorized signatory'),
      deliveryInstructions: z.string().min(1, 'Add delivery instructions'),
    }),
  }),
  defaults: {
    S1: { entityName: '' },
    S2: { jurisdictions: [], specialInstructions: '' },
    S3: { purpose: '', supportingDocument: null },
    [REVIEW_AND_PLACE]: { authorizedSignatory: '', deliveryInstructions: '' },
  },
  toSubmission: (values) => ({
    type: 'CERTIFICATE_OF_GOOD_STANDING',
    entityName: (values.S1 as { entityName?: string } | undefined)?.entityName ?? '',
    jurisdictions: (values.S2 as { jurisdictions?: string[] } | undefined)?.jurisdictions ?? [],
  }),
}
