import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

export const ResetPasswordSchema = z.object({
  username: z.string().min(1, 'Nome ou email é obrigatório'),
  currentPassword: z.string().min(1, 'Senha atual é obrigatória'),
  newPassword: z.string().min(6, 'Nova senha deve ter no mínimo 6 caracteres'),
})

export class ResetPasswordDto extends createZodDto(ResetPasswordSchema) {}
