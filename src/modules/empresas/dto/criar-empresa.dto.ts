import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CriarEmpresaSchema = z.object({
  nomeEmpresa: z.string().min(1),
  cnpj: z.string().optional(),
  numero: z.string().optional(),
  cidade: z.string().optional(),
});

export class CriarEmpresaDto extends createZodDto(CriarEmpresaSchema) {}
