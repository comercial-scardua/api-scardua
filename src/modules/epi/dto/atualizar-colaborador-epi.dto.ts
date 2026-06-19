import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

export const AtualizarColaboradorEpiSchema = z.object({
  epiCargoId: z.number().int().positive().nullable().optional(),
  gestorId: z.number().int().positive().nullable().optional(),
  epiObservacoes: z.string().optional(),
})

export class AtualizarColaboradorEpiDto extends createZodDto(
  AtualizarColaboradorEpiSchema,
) {}
