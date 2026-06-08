import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

export const CriarMovimentacaoEpiSchema = z.object({
  colaborador_id: z.number().int().positive(),
  epi_id: z.number().int().positive(),
  tipo: z.enum(['entrega', 'devolucao', 'troca', 'perda', 'baixa']).default('entrega'),
  quantidade: z.number().int().positive().default(1),
  data_movimentacao: z.string().min(1),
  responsavel: z.string().min(1),
  proxima_entrega: z.string().optional(),
  motivo: z.string().optional(),
  observacoes: z.string().optional(),
  empresaId: z.number().int().positive().optional(),
})

export class CriarMovimentacaoEpiDto extends createZodDto(CriarMovimentacaoEpiSchema) {}
