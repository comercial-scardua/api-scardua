import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const hora = z
  .string()
  .regex(/^\d{2}:\d{2}$/)
  .optional();
const dateStr = z.string().optional();

export const CriarColaboradorSchema = z.object({
  // Identificação
  nome: z.string().min(1),
  sobrenome: z.string().min(1),
  cpf: z.string().min(11, 'CPF inválido'),
  identidade: z.string().optional(),
  pis: z.string().optional(),
  ctps: z.string().optional(),
  cnhNumero: z.string().optional(),
  cnhVencimento: dateStr,

  // Pessoal
  dataNascimento: dateStr,
  idade: z.number().int().optional(),
  estadoCivil: z.string().optional(),
  conjuge: z.string().optional(),
  filiacao: z.string().optional(),

  // Contato
  email: z.string().email().optional(),
  emailProfissional: z.string().email().optional(),
  numeroCelular: z.string().optional(),
  numeroEmergencia: z.string().optional(),
  contato: z.string().optional(),

  // Endereço
  endereco: z.string().optional(),
  bairro: z.string().optional(),
  cidade: z.string().optional(),
  cep: z.string().optional(),
  uf: z.string().optional(),

  // Profissional
  cargo: z.string().optional(),
  setor: z.string().optional(),
  tipo: z.string().optional(),
  empresaId: z.number().int().positive().optional(),
  numeroEmpresa: z.string().optional(),
  admissao: dateStr,
  demissao: dateStr,

  // Financeiro
  banco: z.string().optional(),
  bancoNumero: z.string().optional(),
  contaNumero: z.string().optional(),
  agenciaNumero: z.string().optional(),
  tipoVale: z.string().optional(),
  vt1Valor: z.number().optional(),
  salario: z.number().optional(),
  comissao: z.number().optional(),

  // Gestão / Vínculos
  isGestor: z.boolean().optional(),
  gestorId: z.number().int().positive().optional(),
  userId: z.string().optional(),
  foto: z.string().optional(),
  epiCargoId: z.number().int().positive().optional(),
  epiObservacoes: z.string().optional(),

  // Horário de trabalho
  horaInicio: hora,
  horaFim: hora,
  intervaloAlmoco: z.number().int().optional(),
  trabalhaSegunda: z.boolean().optional(),
  trabalhaTerca: z.boolean().optional(),
  trabalhaQuarta: z.boolean().optional(),
  trabalhaQuinta: z.boolean().optional(),
  trabalhaSexa: z.boolean().optional(),
  trabalhaSabado: z.boolean().optional(),
  trabalhaDomingo: z.boolean().optional(),
});

export class CriarColaboradorDto extends createZodDto(CriarColaboradorSchema) {}
