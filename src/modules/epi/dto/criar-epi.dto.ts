import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

export const CriarEpiSchema = z.object({
  nome: z.string().min(1),
  codigo: z.string().min(1),
  ca: z.string().min(1),
  categoria: z.string().min(1),
  tamanho: z.string().optional(),
  fabricante: z.string().min(1),
  vida_util_dias: z.number().int().positive(),
  estoque_inicial: z.number().int().min(0).default(0),
  estoque_minimo: z.number().int().min(0).default(0),
  observacoes: z.string().optional(),
})

export class CriarEpiDto extends createZodDto(CriarEpiSchema) {}
