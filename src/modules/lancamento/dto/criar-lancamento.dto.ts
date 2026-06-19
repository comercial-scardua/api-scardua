import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

export const LancamentoItemSchema = z.object({
  data: z.string().min(1),
  numeroDocumento: z.string().optional().nullable(),
  observacao: z.string().optional().default(''),
  credito: z.string().optional().nullable(),
  debito: z.string().optional().nullable(),
})

export const CriarLancamentoSchema = z.object({
  contaCorrenteId: z.number().int().positive(),
  data: z.string().min(1),
  numeroDocumento: z.string().optional().nullable(),
  observacao: z.string().default(''),
  credito: z.string().optional().nullable(),
  debito: z.string().optional().nullable(),
})

export class CriarLancamentoDto extends createZodDto(CriarLancamentoSchema) {}

export const LancamentoBulkSchema = z.object({
  contaCorrenteId: z.number().int().positive(),
  clearExisting: z.boolean().optional().default(false),
  lancamentos: z.array(LancamentoItemSchema).optional(),
  // single-item fallback fields
  data: z.string().optional(),
  numeroDocumento: z.string().optional().nullable(),
  observacao: z.string().optional().default(''),
  credito: z.string().optional().nullable(),
  debito: z.string().optional().nullable(),
})

export class LancamentoBulkDto extends createZodDto(LancamentoBulkSchema) {}
