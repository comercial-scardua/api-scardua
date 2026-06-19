import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

export const CriarCaixaViagemSchema = z.object({
  destino: z.string().min(1),
  data: z.string(),
  empresaId: z.number().int().positive().optional().nullable(),
  funcionarioId: z.number().int().positive().optional().nullable(),
  veiculoId: z.number().int().positive().optional().nullable(),
  numeroCaixa: z.number().int().positive().default(1),
  observacao: z.string().optional().nullable(),
  saldoAnterior: z.number().default(0),
  oculto: z.boolean().default(false),
  userId: z.string().optional().nullable(),
})

export class CriarCaixaViagemDto extends createZodDto(CriarCaixaViagemSchema) {}
