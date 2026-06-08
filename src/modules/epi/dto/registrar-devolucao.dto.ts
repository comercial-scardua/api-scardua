import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

export const RegistrarDevolucaoSchema = z.object({
  colaborador_id: z.number().int().positive(),
  epi_id: z.number().int().positive(),
  quantidade: z.number().int().positive().default(1),
  data_movimentacao: z.string().min(1),
  responsavel: z.string().min(1),
  empresaId: z.number().int().positive().optional(),
  motivo: z.string().optional(),
  observacoes: z.string().optional(),
})

export class RegistrarDevolucaoDto extends createZodDto(RegistrarDevolucaoSchema) {}
