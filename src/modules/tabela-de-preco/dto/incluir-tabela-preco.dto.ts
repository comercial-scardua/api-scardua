import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

export const TabelaPrecoItemSchema = z.object({
  produtoCodigo: z.string().min(1),
  produtoNome: z.string().min(1),
  precoVenda: z.number().positive(),
  precoBase: z.number().positive().optional(),
  observacao: z.string().optional().nullable(),
})

export const IncluirTabelaPrecoSchema = z.object({
  empresaId: z.number().int().positive(),
  empresaNome: z.string().min(1),
  descricao: z.string().optional().nullable(),
  itens: z.array(TabelaPrecoItemSchema).min(1),
})

export class IncluirTabelaPrecoDto extends createZodDto(
  IncluirTabelaPrecoSchema,
) {}

export const AtualizarTabelaPrecoSchema = z.object({
  empresaId: z.number().int().positive().optional(),
  empresaNome: z.string().optional(),
  descricao: z.string().optional().nullable(),
  itens: z.array(TabelaPrecoItemSchema).optional(),
})

export class AtualizarTabelaPrecoDto extends createZodDto(
  AtualizarTabelaPrecoSchema,
) {}

export const ImportarTabelaPrecoSchema = z.object({
  empresaId: z.number().int().positive(),
  empresaNome: z.string().min(1),
  itens: z.array(TabelaPrecoItemSchema).min(1),
})

export class ImportarTabelaPrecoDto extends createZodDto(
  ImportarTabelaPrecoSchema,
) {}

export const LimparHistoricoSchema = z.object({
  ids: z.array(z.number().int().positive()).optional(),
})

export class LimparHistoricoDto extends createZodDto(LimparHistoricoSchema) {}
