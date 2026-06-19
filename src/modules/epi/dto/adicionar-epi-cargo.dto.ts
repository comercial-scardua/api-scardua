import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

export const AdicionarEpiCargoSchema = z.object({
  epi_id: z.number().int().positive(),
  periodicidade_troca_dias: z.number().int().positive(),
  quantidade_padrao: z.number().int().positive().default(1),
  obrigatorio: z.boolean().default(true),
})

export class AdicionarEpiCargoDto extends createZodDto(
  AdicionarEpiCargoSchema,
) {}
