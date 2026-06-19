import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

export const AtualizarManualSchema = z.object({
  assunto: z.string().min(1).optional(),
  departamento: z.string().min(1).optional(),
  descricao: z.string().min(1).optional(),
  restrito: z.boolean().optional(),
})

export class AtualizarManualDto extends createZodDto(AtualizarManualSchema) {}
