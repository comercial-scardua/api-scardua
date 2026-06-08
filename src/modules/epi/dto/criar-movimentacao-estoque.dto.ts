import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

export const CriarMovimentacaoEstoqueSchema = z.object({
  epi_id: z.number().int().positive(),
  tipo: z.enum(['entrada', 'saida', 'ajuste', 'perda', 'devolucao']),
  quantidade: z.number().int(),
  data_movimentacao: z.string().optional(),
  responsavel: z.string().min(1),
  observacoes: z.string().optional(),
  empresaId: z.number().int().positive().optional(),
})

export class CriarMovimentacaoEstoqueDto extends createZodDto(CriarMovimentacaoEstoqueSchema) {}
