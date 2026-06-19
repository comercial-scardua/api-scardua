import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

export const CriarNcSgqSchema = z.object({
  code: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  origin: z.enum([
    'INTERNAL',
    'EXTERNAL',
    'AUDIT',
    'CUSTOMER_COMPLAINT',
    'INTERNAL_AUDIT',
  ]),
  processId: z.number().int().optional(),
  processName: z.string().optional(),
  ownerId: z.string().min(1),
  ownerName: z.string().min(1),
  openingDate: z.coerce.date().optional(),
  deadline: z.coerce.date().optional(),
  closureDate: z.coerce.date().optional(),
  status: z
    .enum(['OPEN', 'ANALYSIS', 'ACTION', 'VERIFICATION', 'CLOSED'])
    .optional(),
  rootCauseAnalysis: z.string().optional(),
  immediateAction: z.string().optional(),
  evidenceFiles: z.string().optional(),
  closureNotes: z.string().optional(),
  createdBy: z.string().optional(),
})

export class CriarNcSgqDto extends createZodDto(CriarNcSgqSchema) {}
