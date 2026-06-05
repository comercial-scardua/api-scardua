import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const AtualizarPatrimonioSchema = z.object({
  nome: z.string().optional(),
  descricao: z.string().optional(),
  data_aquisicao: z.string().optional(),
  valor: z.string().optional(),
  status: z.string().optional(),
  fabricante: z.string().optional(),
  modelo: z.string().optional(),
  tipo: z.string().optional(),
  localizacao: z.string().optional(),
  responsavelId: z.number().int().positive().optional(),
  numeroNotaFiscal: z.string().optional(),
  dataNotaFiscal: z.string().optional(),
  dataGarantia: z.string().optional(),
  placa: z.string().optional(),
  renavan: z.string().optional(),
  anoModelo: z.number().int().optional(),
  kmEntrega: z.string().optional(),
  locado: z.boolean().optional(),
  franquia: z.string().optional(),
  proprietario: z.string().optional(),
  segurado: z.boolean().optional(),
  seguradora: z.string().optional(),
  dataVencimentoSeguro: z.string().optional(),
  numeroLinha: z.string().optional(),
  operadora: z.string().optional(),
  numeroSerie: z.string().optional(),
  oculto: z.boolean().optional(),
});

export class AtualizarPatrimonioDto extends createZodDto(AtualizarPatrimonioSchema) {}
