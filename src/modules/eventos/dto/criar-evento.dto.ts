import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CriarEventoSchema = z.object({
  tipo: z.string().min(1),
  titulo: z.string().min(1),
  descricao: z.string().optional().nullable(),
  dataInicio: z.string().or(z.date()).transform((v) => new Date(v)),
  dataFim: z
    .string()
    .or(z.date())
    .transform((v) => new Date(v))
    .optional()
    .nullable(),
  empresaId: z.number().int().positive().optional().nullable(),
  responsavelId: z.number().int().positive().optional().nullable(),
  cor: z.string().optional().nullable(),
  oculto: z.boolean().default(false),
});

export class CriarEventoDto extends createZodDto(CriarEventoSchema) {}
