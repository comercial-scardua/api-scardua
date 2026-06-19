import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

export const CriarManualSchema = z.object({
  assunto: z.string().min(1),
  departamento: z.string().min(1),
  descricao: z.string().min(1),
  restrito: z.boolean().default(false),
})

export class CriarManualDto extends createZodDto(CriarManualSchema) {}
