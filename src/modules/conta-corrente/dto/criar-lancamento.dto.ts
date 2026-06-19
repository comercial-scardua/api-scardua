import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

export const CriarLancamentoSchema = z.object({
  data: z.string(),
  numeroDocumento: z.string().optional(),
  observacao: z.string().default(''),
  credito: z.string().optional(),
  debito: z.string().optional(),
})

export class CriarLancamentoDto extends createZodDto(CriarLancamentoSchema) {}
