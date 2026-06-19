import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

export const AtualizarCargoEpiSchema = z.object({
  nome: z.string().min(1).optional(),
  descricao: z.string().optional(),
})

export class AtualizarCargoEpiDto extends createZodDto(
  AtualizarCargoEpiSchema,
) {}
