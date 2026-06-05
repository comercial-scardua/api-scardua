import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CriarContaCorrenteSchema = z.object({
  data: z.string().optional(),
  tipo: z.string().default('EXTRA_CAIXA'),
  fornecedorCliente: z.string().default(''),
  observacao: z.string().default(''),
  setor: z.string().default(''),
  empresaId: z.number().int().positive().optional().nullable(),
  colaboradorId: z.number().int().positive().optional().nullable(),
  oculto: z.boolean().default(false),
});

export class CriarContaCorrenteDto extends createZodDto(CriarContaCorrenteSchema) {}
