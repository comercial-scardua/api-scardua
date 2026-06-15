import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const AtualizarCaixaViagemSchema = z.object({
  destino: z.string().min(1).optional(),
  data: z.string().optional(),
  empresaId: z.number().int().positive().optional().nullable(),
  funcionarioId: z.number().int().positive().optional().nullable(),
  veiculoId: z.number().int().positive().optional().nullable(),
  numeroCaixa: z.number().int().positive().optional(),
  observacao: z.string().optional().nullable(),
  saldoAnterior: z.number().optional(),
  oculto: z.boolean().optional(),
  userId: z.string().optional().nullable(),
});

export class AtualizarCaixaViagemDto extends createZodDto(AtualizarCaixaViagemSchema) {}
