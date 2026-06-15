import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CriarErroSchema = z.object({
  titulo: z.string().min(1),
  categoria: z.string().min(1),
  descricao: z.string().optional().nullable(),
  solucao: z.string().optional().nullable(),
  usuario_id: z.number().int().positive().optional().nullable(),
  usuario_nome: z.string().optional().nullable(),
  tags: z.string().optional().nullable(),
  restrito: z.boolean().default(false),
  ativo: z.boolean().default(true),
});

export class CriarErroDto extends createZodDto(CriarErroSchema) {}
