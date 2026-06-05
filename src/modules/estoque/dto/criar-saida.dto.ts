import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CriarSaidaSchema = z.object({
  produtoId: z.number().int().positive(),
  quantidade: z.number().int().positive('Quantidade deve ser maior que zero'),
  dataSaida: z.string(),
  responsavel: z.string().min(1),
  motivo: z.string().optional(),
  observacoes: z.string().optional(),
  empresaId: z.number().int().positive().optional().nullable(),
});

export class CriarSaidaDto extends createZodDto(CriarSaidaSchema) {}
