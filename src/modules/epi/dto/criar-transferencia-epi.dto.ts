import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

export const CriarTransferenciaEpiSchema = z
  .object({
    produtoId: z.number().int().positive(),
    empresaOrigemId: z.number().int().positive(),
    empresaDestinoId: z.number().int().positive(),
    quantidade: z.number().int().positive(),
    dataTransferencia: z.string().min(1),
    responsavel: z.string().min(1),
    observacoes: z.string().optional(),
  })
  .refine((d) => d.empresaOrigemId !== d.empresaDestinoId, {
    message: 'Origem e destino devem ser diferentes',
    path: ['empresaDestinoId'],
  })

export class CriarTransferenciaEpiDto extends createZodDto(CriarTransferenciaEpiSchema) {}
