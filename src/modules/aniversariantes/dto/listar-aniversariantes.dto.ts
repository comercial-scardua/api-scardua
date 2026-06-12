import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const ListarAniversariantesSchema = z.object({
  mes: z.coerce.number().int().min(1).max(12).optional(),
});

export class ListarAniversariantesDto extends createZodDto(
  ListarAniversariantesSchema,
) {}
