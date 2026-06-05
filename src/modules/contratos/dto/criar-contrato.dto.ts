import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CriarContratoSchema = z
  .object({
    numero: z.string().min(1),
    titulo: z.string().min(1),
    fornecedor: z.string().min(1),
    valor: z.number().positive('Valor deve ser maior que zero'),
    data_inicio: z.string().min(1),
    data_vencimento: z.string().optional(),
    vencimento_indeterminado: z.boolean().default(false),
    departamento: z.string().min(1),
    responsavel: z.string().min(1),
    descricao: z.string().optional(),
    tipo_contrato: z.string().default('prestacao_servico'),
    renovacao_automatica: z.boolean().optional().default(false),
    alertas_ativos: z.boolean().optional().default(true),
    observacao: z.string().optional(),
  })
  .refine(
    (d) => d.vencimento_indeterminado || !!d.data_vencimento,
    { message: 'data_vencimento obrigatória quando vencimento não é indeterminado', path: ['data_vencimento'] },
  );

export class CriarContratoDto extends createZodDto(CriarContratoSchema) {}
