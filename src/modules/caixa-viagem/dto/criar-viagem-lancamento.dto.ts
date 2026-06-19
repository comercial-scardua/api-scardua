import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

export const CriarViagemLancamentoSchema = z.object({
  data: z.string(),
  custo: z.string().min(1),
  clienteFornecedor: z.string().min(1),
  entrada: z.string().optional().nullable(),
  saida: z.string().optional().nullable(),
  numeroDocumento: z.string().optional().nullable(),
  historicoDoc: z.string().optional().nullable(),
  caixaViagemId: z.number().int().positive().optional().nullable(),
})

export class CriarViagemLancamentoDto extends createZodDto(
  CriarViagemLancamentoSchema,
) {}
