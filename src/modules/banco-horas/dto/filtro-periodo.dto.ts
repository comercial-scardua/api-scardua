import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

export const FiltroPeriodoSchema = z.object({
  dataInicio: z.coerce.date().optional(),
  dataFim: z.coerce.date().optional(),
  colaboradorId: z.number().int().positive().optional(),
})

export class FiltroPeriodoDto extends createZodDto(FiltroPeriodoSchema) {}
