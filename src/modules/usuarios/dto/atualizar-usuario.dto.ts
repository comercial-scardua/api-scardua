import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const AtualizarUsuarioSchema = z.object({
  nome: z.string().min(1).optional(),
  sobrenome: z.string().min(1).optional(),
  email: z.string().email().optional(),
  role: z.enum(['USER', 'ADMIN']).optional(),
  setor: z.string().optional(),
  ramal: z.string().optional(),
  isTecnico: z.boolean().optional(),
  foto: z.string().optional(),
  especialidades: z.string().optional(),
  oculto: z.boolean().optional(),
});

export class AtualizarUsuarioDto extends createZodDto(AtualizarUsuarioSchema) {}
