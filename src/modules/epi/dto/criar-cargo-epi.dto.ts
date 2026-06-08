import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

export const CriarCargoEpiSchema = z.object({
  nome: z.string().min(1),
  descricao: z.string().optional(),
})

export class CriarCargoEpiDto extends createZodDto(CriarCargoEpiSchema) {}
