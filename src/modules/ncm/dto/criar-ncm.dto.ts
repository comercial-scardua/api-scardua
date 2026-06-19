import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

export const CriarNcmSchema = z.object({
  codigo_ncm: z.string().min(1),
  categoria_cliente: z.string().min(1),
  empresa: z.string().min(1),
  uf_emissor: z.string().length(2),
  uf_destino: z.string().length(2),
  cst_origem: z.string().default(''),
  icms_dentro: z.number().default(0),
  icms_fora: z.number().default(0),
  fora_st: z.enum(['SIM', 'Não']).default('Não'),
  fora_difal: z.enum(['SIM', 'Não']).default('Não'),
  monofasico: z.enum(['SIM', 'Não']).default('Não'),
  pis: z.number().default(0),
  cofins: z.number().default(0),
  ipi: z.number().default(0),
  bc_pis_cof: z.string().default(''),
  bc_icms: z.string().default(''),
  mva: z.number().default(0),
  aliquota: z.number().default(0),
  obs_fonte: z.string().optional(),
})

export class CriarNcmDto extends createZodDto(CriarNcmSchema) {}
