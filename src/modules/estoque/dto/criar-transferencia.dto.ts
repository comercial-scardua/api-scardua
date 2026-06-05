import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CriarTransferenciaSchema = z
  .object({
    produtoId: z.number().int().positive(),
    empresaOrigemId: z.number().int().positive(),
    empresaDestinoId: z.number().int().positive(),
    quantidade: z.number().int().positive('Quantidade deve ser maior que zero'),
    dataTransferencia: z.string(),
    responsavel: z.string().min(1),
    observacoes: z.string().optional(),
  })
  .refine((d) => d.empresaOrigemId !== d.empresaDestinoId, {
    message: 'Empresa de origem e destino devem ser diferentes',
    path: ['empresaDestinoId'],
  });

export class CriarTransferenciaDto extends createZodDto(CriarTransferenciaSchema) {}
