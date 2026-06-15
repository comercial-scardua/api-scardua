import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CriarLancamentoViagemSchema = z.object({
  caixaViagemId: z.number().int().positive().optional().nullable(),
  data: z.string().min(1),
  custo: z.string().min(1),
  clienteFornecedor: z.string().min(1),
  entrada: z.string().optional().nullable(),
  saida: z.string().optional().nullable(),
  numeroDocumento: z.string().optional().nullable(),
  historicoDoc: z.string().optional().nullable(),
});

export class CriarLancamentoViagemDto extends createZodDto(
  CriarLancamentoViagemSchema,
) {}
