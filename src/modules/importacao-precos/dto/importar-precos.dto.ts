import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

export const ImportarPrecosItemSchema = z.object({
  codigoInterno: z.string().min(1),
  nome: z.string().min(1),
  categoria: z.string().min(1),
  descricao: z.string().optional().nullable(),
  unidade: z.string().min(1),
  estoqueMinimo: z.number().int().default(0),
  estoqueAtual: z.number().int().default(0),
  status: z.enum(['ATIVO', 'INATIVO']).default('ATIVO'),
})

export const ImportarPrecosSchema = z.object({
  produtos: z.array(ImportarPrecosItemSchema).min(1),
})

export class ImportarPrecosDto extends createZodDto(ImportarPrecosSchema) {}
