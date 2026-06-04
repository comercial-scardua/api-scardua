import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const DefinirPermissaoPaginaSchema = z.object({
  canAccess: z.boolean().default(false),
  canEdit: z.boolean().default(false),
  canDelete: z.boolean().default(false),
});

export class DefinirPermissaoPaginaDto extends createZodDto(
  DefinirPermissaoPaginaSchema,
) {}
