import { Controller, Get, HttpCode, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { z } from 'zod'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { ListUsuariosUseCase } from '../../../../domain/usuarios/application/use-cases/list-usuarios'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const listUsuariosQuerySchema = z.object({
  setor: z.string().optional(),
  role: z.string().optional(),
  oculto: z
    .enum(['true', 'false'])
    .transform((v) => v === 'true')
    .optional(),
})

type ListUsuariosQuery = z.infer<typeof listUsuariosQuerySchema>

@ApiTags('Usuários')
@ApiBearerAuth()
@Controller('/usuarios')
@UseGuards(PermissionsGuard)
export class ListUsuariosController {
  constructor(private listUsuarios: ListUsuariosUseCase) {}

  @Get()
  @HttpCode(200)
  @RequirePermission('usuarios', 'access')
  @ApiOperation({ summary: 'Listar usuários' })
  @ApiQuery({ name: 'setor', required: false })
  @ApiQuery({ name: 'role', required: false })
  @ApiQuery({ name: 'oculto', required: false, type: Boolean })
  async handle(
    @Query(new ZodValidationPipe(listUsuariosQuerySchema))
    query: ListUsuariosQuery,
  ) {
    const result = await this.listUsuarios.execute(query)
    return { usuarios: result.value!.usuarios }
  }
}
