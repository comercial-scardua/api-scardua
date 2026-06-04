import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const AtualizarEmpresaSchema = z.object({
  nomeEmpresa: z.string().min(1).optional(),
  cnpj: z.string().optional(),
  numero: z.string().optional(),
  cidade: z.string().optional(),
  oculto: z.boolean().optional(),
});

export class AtualizarEmpresaDto extends createZodDto(AtualizarEmpresaSchema) {}
