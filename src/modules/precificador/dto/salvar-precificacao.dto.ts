import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const SalvarPrecificacaoSchema = z.object({
  userId: z.string().min(1),
  empresaId: z.number().int().positive(),
  empresaNome: z.string().min(1),
  produtoCodigo: z.string().min(1),
  produtoNome: z.string().min(1),
  posicaoFiscal: z.string().optional().nullable(),
  tipoPrecoBase: z.string().min(1),
  custoBase: z.number().positive(),
  custosFixosPerc: z.number().min(0),
  outrosCustosCompraPerc: z.number().min(0).default(0),
  outrosCustosVendaPerc: z.number().min(0).default(0),
  lucroPercDesejado: z.number().min(0),
  ncmCodigo: z.string().optional().nullable(),
  ncmCategoria: z.string().optional().nullable(),
  vendaFora: z.boolean().default(false),
  precoFinal: z.number().positive(),
  lucroLiquido: z.number(),
  margemLiquida: z.number(),
});

export class SalvarPrecificacaoDto extends createZodDto(SalvarPrecificacaoSchema) {}

export const AtualizarPrecoItemSchema = z.object({
  produtoId: z.number().int().positive(),
  preco: z.number().positive(),
});

export const AtualizarPrecosSchema = z.object({
  itens: z.array(AtualizarPrecoItemSchema).min(1),
});

export class AtualizarPrecosDto extends createZodDto(AtualizarPrecosSchema) {}
