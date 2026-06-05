import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CriarProdutoSchema = z.object({
  codigoInterno: z.string().min(1),
  nome: z.string().min(1),
  categoria: z.string().min(1),
  unidade: z.string().min(1),
  descricao: z.string().optional(),
  estoqueMinimo: z.number().int().min(0).default(0),
  status: z.enum(['ATIVO', 'INATIVO']).default('ATIVO'),
});

export class CriarProdutoDto extends createZodDto(CriarProdutoSchema) {}
