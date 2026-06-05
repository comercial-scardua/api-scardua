import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const AtualizarContratoSchema = z.object({
  titulo: z.string().min(1).optional(),
  fornecedor: z.string().min(1).optional(),
  valor: z.number().positive().optional(),
  data_inicio: z.string().optional(),
  data_vencimento: z.string().optional(),
  vencimento_indeterminado: z.boolean().optional(),
  departamento: z.string().min(1).optional(),
  responsavel: z.string().min(1).optional(),
  descricao: z.string().optional(),
  tipo_contrato: z.string().optional(),
  renovacao_automatica: z.boolean().optional(),
  alertas_ativos: z.boolean().optional(),
  observacao: z.string().optional(),
});

export class AtualizarContratoDto extends createZodDto(AtualizarContratoSchema) {}
