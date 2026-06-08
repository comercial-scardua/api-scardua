import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

export const AtualizarEpiSchema = z.object({
  nome: z.string().min(1).optional(),
  ca: z.string().min(1).optional(),
  categoria: z.string().min(1).optional(),
  tamanho: z.string().optional(),
  fabricante: z.string().min(1).optional(),
  vida_util_dias: z.number().int().positive().optional(),
  estoque_minimo: z.number().int().min(0).optional(),
  status: z.enum(['ATIVO', 'INATIVO']).optional(),
  observacoes: z.string().optional(),
})

export class AtualizarEpiDto extends createZodDto(AtualizarEpiSchema) {}
