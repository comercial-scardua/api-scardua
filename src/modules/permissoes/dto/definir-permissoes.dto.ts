import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

const PermissaoPaginaSchema = z.object({
  canAccess: z.boolean().default(false),
  canEdit: z.boolean().default(false),
  canDelete: z.boolean().default(false),
})

export const DefinirPermissoesSchema = z.object({
  permissions: z.record(z.string(), PermissaoPaginaSchema).default({}),
  restritoDepartamentos: z.array(z.string()).optional().default([]),
  relatoriosRestritoDepartamentos: z.array(z.string()).optional().default([]),
})

export class DefinirPermissoesDto extends createZodDto(
  DefinirPermissoesSchema,
) {}
