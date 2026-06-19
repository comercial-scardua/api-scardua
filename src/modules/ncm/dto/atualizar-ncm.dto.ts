import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

export const AtualizarNcmSchema = z.object({
  icms_dentro: z.number().optional(),
  icms_fora: z.number().optional(),
  fora_st: z.enum(['SIM', 'Não']).optional(),
  fora_difal: z.enum(['SIM', 'Não']).optional(),
  monofasico: z.enum(['SIM', 'Não']).optional(),
  pis: z.number().optional(),
  cofins: z.number().optional(),
  ipi: z.number().optional(),
  bc_pis_cof: z.string().optional(),
  bc_icms: z.string().optional(),
  mva: z.number().optional(),
  aliquota: z.number().optional(),
  obs_fonte: z.string().optional(),
})

export class AtualizarNcmDto extends createZodDto(AtualizarNcmSchema) {}
