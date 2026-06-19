import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

export const CriarEntradaSchema = z.object({
  produtoId: z.number().int().positive(),
  empresaId: z.number().int().positive().optional().nullable(),
  quantidade: z.number().int().positive('Quantidade deve ser maior que zero'),
  dataEntrada: z.string(),
  numeroNotaFiscal: z.string().optional(),
  observacoes: z.string().optional(),
})

export class CriarEntradaDto extends createZodDto(CriarEntradaSchema) {}
