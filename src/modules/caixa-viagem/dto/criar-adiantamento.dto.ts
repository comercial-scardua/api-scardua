import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

export const CriarAdiantamentoSchema = z.object({
  data: z.string(),
  saida: z.string(),
  observacao: z.string().optional().nullable(),
  nome: z.string().min(1),
  caixaViagemId: z.number().int().positive().optional().nullable(),
  colaboradorId: z.number().int().positive().optional().nullable(),
  userId: z.string().optional().nullable(),
  oculto: z.boolean().default(false),
})

export class CriarAdiantamentoDto extends createZodDto(
  CriarAdiantamentoSchema,
) {}
