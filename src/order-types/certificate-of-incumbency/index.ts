import { z } from 'zod'
import type { OrderTypeDefinition } from '../../registry/types'
import { REVIEW_AND_PLACE, SECTION_KEYS } from '../../sections/keys'

const uploadedFile = z.object({
  name: z.string().min(1),
  size: z.number(),
  type: z.string(),
  dataUrl: z.string().min(1),
})

export const certificateOfIncumbency: OrderTypeDefinition = {
  key: 'CERTIFICATE_OF_INCUMBENCY',
  label: 'Certificate of Incumbency',
  category: 'Corporate records',
  description:
    'Request a certificate listing current officers, directors, and signing authority.',
  sections: [
    {
      key: 'S1',
      sectionKey: SECTION_KEYS.TEXT_AND_FILE,
      title: 'Company',
      fields: {
        text: {
          key: 'companyName',
          label: 'Company name',
          placeholder: 'Acme Holdings LLC',
        },
        file: {
          key: 'formationDocument',
          label: 'Formation document',
          helpText: 'Articles or certificate of formation. 1.5 MB or smaller.',
        },
      },
    },
    {
      key: 'S2',
      sectionKey: SECTION_KEYS.DESCRIPTION,
      title: 'Officers',
      fields: {
        description: {
          key: 'officerDetails',
          label: 'Officers and directors',
          placeholder: 'List each officer or director and their title',
        },
      },
    },
    {
      key: 'S3',
      sectionKey: SECTION_KEYS.TEXT_AND_FILE,
      title: 'Registered agent',
      fields: {
        text: {
          key: 'registeredAgent',
          label: 'Registered agent',
          placeholder: 'Name of the registered agent',
        },
        file: {
          key: 'authorizationLetter',
          label: 'Authorization letter',
          helpText: 'Signed authorization for this request. 1.5 MB or smaller.',
        },
      },
    },
    {
      key: 'S4',
      sectionKey: SECTION_KEYS.DESCRIPTION,
      title: 'Remarks',
      fields: {
        description: {
          key: 'remarks',
          label: 'Additional remarks',
          placeholder: 'Any other facts the certificate should include',
        },
      },
    },
    {
      key: REVIEW_AND_PLACE,
      sectionKey: REVIEW_AND_PLACE,
      title: 'Review and place',
      fields: {
        text: {
          key: 'confirmingOfficer',
          label: 'Confirming officer',
          placeholder: 'Officer confirming the incumbency details',
        },
        description: {
          key: 'deliveryNotes',
          label: 'Delivery notes',
          placeholder: 'Where the certificate should be sent',
        },
      },
    },
  ],
  schema: z.object({
    S1: z.object({
      companyName: z.string().min(1, 'Enter the company name'),
      formationDocument: uploadedFile,
    }),
    S2: z.object({
      officerDetails: z.string().min(1, 'List the officers and directors'),
    }),
    S3: z.object({
      registeredAgent: z.string().min(1, 'Enter the registered agent'),
      authorizationLetter: uploadedFile,
    }),
    S4: z.object({
      remarks: z.string().min(1, 'Add remarks or write none'),
    }),
    [REVIEW_AND_PLACE]: z.object({
      confirmingOfficer: z.string().min(1, 'Enter the confirming officer'),
      deliveryNotes: z.string().min(1, 'Add delivery notes'),
    }),
  }),
  defaults: {
    S1: { companyName: '', formationDocument: null },
    S2: { officerDetails: '' },
    S3: { registeredAgent: '', authorizationLetter: null },
    S4: { remarks: '' },
    [REVIEW_AND_PLACE]: { confirmingOfficer: '', deliveryNotes: '' },
  },
  toSubmission: (values) => ({
    type: 'CERTIFICATE_OF_INCUMBENCY',
    companyName: (values.S1 as { companyName?: string } | undefined)?.companyName ?? '',
    registeredAgent: (values.S3 as { registeredAgent?: string } | undefined)?.registeredAgent ?? '',
  }),
}
