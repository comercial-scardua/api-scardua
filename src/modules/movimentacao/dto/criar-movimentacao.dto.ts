import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const CriarMovimentacaoSchema = z.object({
  patrimonioId: z.number().int(),
  tipo: z.string().min(1),
  localizacaoNova: z.string().optional(),
  responsavelNovoId: z.number().int().optional(),
  kmNovo: z.string().optional(),
});

export class CriarMovimentacaoDto extends createZodDto(CriarMovimentacaoSchema) {}
