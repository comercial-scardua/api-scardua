import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CriarRelatorioSchema = z.object({
  nome: z.string().min(1),
  departamento: z.string().min(1),
  descricao: z.string().optional().nullable(),
  query_sql: z.string().min(1),
  restrito: z.boolean().default(false),
  usuario_id: z.number().int().positive().optional().nullable(),
  usuario_nome: z.string().optional().nullable(),
  banco_dados: z.string().default('oracle'),
  parametros: z.string().optional().nullable(),
  ativo: z.boolean().default(true),
});

export class CriarRelatorioDto extends createZodDto(CriarRelatorioSchema) {}
