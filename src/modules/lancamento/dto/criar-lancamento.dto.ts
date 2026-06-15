import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CriarLancamentoSchema = z.object({
  contaCorrenteId: z.number().int().positive(),
  data: z.string().min(1),
  numeroDocumento: z.string().optional().nullable(),
  observacao: z.string().default(''),
  credito: z.string().optional().nullable(),
  debito: z.string().optional().nullable(),
});

export class CriarLancamentoDto extends createZodDto(CriarLancamentoSchema) {}
