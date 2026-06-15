import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

export const CriarProcessoSgqSchema = z.object({
  code: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
  status: z.string().optional(),
  ownerId: z.string().min(1),
  ownerName: z.string().min(1),
  createdBy: z.string().optional(),
})

export class CriarProcessoSgqDto extends createZodDto(CriarProcessoSgqSchema) {}
