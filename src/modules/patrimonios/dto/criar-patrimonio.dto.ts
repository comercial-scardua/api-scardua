import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CriarPatrimonioSchema = z
  .object({
    nome: z.string().optional(),
    descricao: z.string().optional(),
    data_aquisicao: z.string().optional(),
    valor: z.string().optional(),
    status: z.string().optional(),
    fabricante: z.string().min(1),
    modelo: z.string().optional(),
    tipo: z.string().min(1),
    localizacao: z.string().min(1),
    responsavelId: z.number().int().positive(),
    numeroNotaFiscal: z.string().optional(),
    dataNotaFiscal: z.string().optional(),
    dataGarantia: z.string().optional(),
    // Veículo
    placa: z.string().optional(),
    renavan: z.string().optional(),
    anoModelo: z.number().int().optional(),
    kmEntrega: z.string().optional(),
    locado: z.boolean().default(false),
    franquia: z.string().optional(),
    proprietario: z.string().optional(),
    segurado: z.boolean().default(false),
    seguradora: z.string().optional(),
    dataVencimentoSeguro: z.string().optional(),
    // Linha telefônica
    numeroLinha: z.string().optional(),
    operadora: z.string().optional(),
    // Geral
    numeroSerie: z.string().optional(),
  })
  .superRefine((d, ctx) => {
    if (d.tipo === 'Veículo') {
      if (!d.placa) ctx.addIssue({ code: 'custom', path: ['placa'], message: 'Obrigatório para veículos' });
      if (!d.renavan) ctx.addIssue({ code: 'custom', path: ['renavan'], message: 'Obrigatório para veículos' });
      if (!d.anoModelo) ctx.addIssue({ code: 'custom', path: ['anoModelo'], message: 'Obrigatório para veículos' });
    }
    if (d.tipo === 'Linhas Telefônicas') {
      if (!d.numeroLinha) ctx.addIssue({ code: 'custom', path: ['numeroLinha'], message: 'Obrigatório para linhas telefônicas' });
      if (!d.operadora) ctx.addIssue({ code: 'custom', path: ['operadora'], message: 'Obrigatório para linhas telefônicas' });
    }
  });

export class CriarPatrimonioDto extends createZodDto(CriarPatrimonioSchema) {}
