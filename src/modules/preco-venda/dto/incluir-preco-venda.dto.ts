import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const IncluirPrecoVendaSchema = z.object({
  produtoId: z.number().int().positive(),
  // O modelo products não possui campo precoVenda nativamente — armazenamos na descrição ou
  // ignoramos graciosamente. Aqui mantemos o campo para o contrato da API.
  precoVenda: z.number().positive(),
  observacao: z.string().optional().nullable(),
});

export class IncluirPrecoVendaDto extends createZodDto(IncluirPrecoVendaSchema) {}

export const ImportarPrecoVendaItemSchema = z.object({
  produtoId: z.number().int().positive(),
  precoVenda: z.number().positive(),
});

export const ImportarPrecoVendaSchema = z.object({
  itens: z.array(ImportarPrecoVendaItemSchema).min(1),
});

export class ImportarPrecoVendaDto extends createZodDto(ImportarPrecoVendaSchema) {}
