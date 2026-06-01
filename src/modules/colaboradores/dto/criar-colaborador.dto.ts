import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CriarColaboradorSchema = z.object({
  nome: z.string().min(1),
  sobrenome: z.string().min(1),
  cpf: z.string().min(11, 'CPF inválido'),
  email: z.string().email().optional(),
  cargo: z.string().optional(),
  setor: z.string().optional(),
  empresaId: z.number().int().positive().optional(),
  admissao: z.string().datetime({ offset: true }).optional(),
  horaInicio: z
    .string()
    .regex(/^\d{2}:\d{2}$/)
    .optional(),
  horaFim: z
    .string()
    .regex(/^\d{2}:\d{2}$/)
    .optional(),
});

export class CriarColaboradorDto extends createZodDto(CriarColaboradorSchema) {}
