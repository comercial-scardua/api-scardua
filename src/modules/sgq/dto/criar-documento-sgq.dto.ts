import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

export const CriarDocumentoSgqSchema = z.object({
  code: z.string().min(1),
  title: z.string().min(1),
  type: z.enum(['PROCEDURE', 'WORK_INSTRUCTION', 'FORM', 'POLICY', 'RECORD', 'OTHER']),
  description: z.string().optional(),
  processId: z.number().int().optional(),
  processName: z.string().optional(),
  ownerId: z.string().min(1),
  ownerName: z.string().min(1),
  currentVersion: z.string().optional(),
  status: z.enum(['DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'ARCHIVED', 'OBSOLETE']).optional(),
  issueDate: z.coerce.date().optional(),
  reviewDate: z.coerce.date().optional(),
  fileUrl: z.string().optional(),
  attachments: z.string().optional(),
  approvedById: z.string().optional(),
  approvedByName: z.string().optional(),
  approvalDate: z.coerce.date().optional(),
  approvalComments: z.string().optional(),
  createdBy: z.string().optional(),
})

export class CriarDocumentoSgqDto extends createZodDto(CriarDocumentoSgqSchema) {}
