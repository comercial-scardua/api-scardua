import { z } from 'zod'

export const CriarUsuarioSchema = z.object({
  nome: z.string().min(1),
  sobrenome: z.string().min(1),
  email: z.string().email(),
  cpf: z.string().min(11, 'CPF inválido'),
  password: z.string().min(6, 'Senha deve ter ao menos 6 caracteres'),
  role: z.enum(['USER', 'ADMIN']).optional(),
  setor: z.string().optional(),
  ramal: z.string().optional(),
  isTecnico: z.boolean().optional(),
  foto: z.string().optional(),
  especialidades: z.string().optional(),
})

export const AtualizarUsuarioSchema = z.object({
  nome: z.string().min(1).optional(),
  sobrenome: z.string().min(1).optional(),
  email: z.string().email().optional(),
  role: z.enum(['USER', 'ADMIN']).optional(),
  setor: z.string().optional(),
  ramal: z.string().optional(),
  isTecnico: z.boolean().optional(),
  foto: z.string().optional(),
  especialidades: z.string().optional(),
  oculto: z.boolean().optional(),
})

export type CreateUsuarioInput = z.infer<typeof CriarUsuarioSchema>
export type UpdateUsuarioInput = z.infer<typeof AtualizarUsuarioSchema>
