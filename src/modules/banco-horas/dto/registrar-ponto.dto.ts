import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const RegistrarPontoSchema = z.object({
  colaboradorId: z.number().int().positive(),
  tipo: z.enum(['ENTRADA', 'SAIDA', 'INTERVALO_INICIO', 'INTERVALO_FIM', 'AJUSTE']),
  data: z.coerce.date(),
  horaInicio: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  horaFim: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  intervaloMinutos: z.number().int().min(0).optional(),
  horasCorrigidas: z.number().min(0).optional(),
  acao: z.string().optional(),
  observacao: z.string().optional(),
});

export class RegistrarPontoDto extends createZodDto(RegistrarPontoSchema) {}
