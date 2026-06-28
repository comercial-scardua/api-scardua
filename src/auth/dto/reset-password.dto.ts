import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

export const ResetPasswordSchema = z.object({
  username: z.string().min(1, 'Nome ou email é obrigatório'),
  currentPassword: z.string().min(1, 'Senha atual é obrigatória'),
  newPassword: z
    .string()
    .min(8, 'Nova senha deve ter no mínimo 8 caracteres')
    .regex(/[A-Z]/, 'Senha deve conter ao menos uma letra maiúscula')
    .regex(/[a-z]/, 'Senha deve conter ao menos uma letra minúscula')
    .regex(/[0-9]/, 'Senha deve conter ao menos um número'),
})

export class ResetPasswordDto extends createZodDto(ResetPasswordSchema) {}
