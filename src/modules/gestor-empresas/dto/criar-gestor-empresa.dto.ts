import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CriarGestorEmpresaSchema = z.object({
  colaboradorId: z.number().int().positive(),
  empresaId: z.number().int().positive(),
});

export class CriarGestorEmpresaDto extends createZodDto(CriarGestorEmpresaSchema) {}
