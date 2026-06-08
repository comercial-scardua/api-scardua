import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

export const EntradaEstoqueSchema = z.object({
  epi_id: z.number().int().positive(),
  quantidade: z.number().int().positive(),
  data_movimentacao: z.string().min(1),
  responsavel: z.string().min(1),
  empresaId: z.number().int().positive().optional(),
  observacoes: z.string().optional(),
})

export class EntradaEstoqueDto extends createZodDto(EntradaEstoqueSchema) {}
