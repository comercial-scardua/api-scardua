import { Controller, Get, HttpCode, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { z } from 'zod'
import { CurrentUser } from '../../../../auth/decorators/current-user.decorator'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import type { JwtPayload } from '../../../../auth/types/jwt-payload.type'
import { ListColaboradoresUseCase } from '../../../../domain/uniforme/application/use-cases/list-colaboradores'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const listColaboradoresQuerySchema = z.object({
  empresaId: z.coerce.number().int().positive().optional(),
  status: z.enum(['ativo', 'inativo']).optional(),
})

type ListColaboradoresQuery = z.infer<typeof listColaboradoresQuerySchema>

@ApiTags('Uniforme')
@ApiBearerAuth()
@Controller('/uniforme/colaboradores')
@UseGuards(PermissionsGuard)
export class ListColaboradoresController {
  constructor(private listColaboradores: ListColaboradoresUseCase) {}

  @Get()
  @HttpCode(200)
  @RequirePermission('uniforme', 'access')
  @ApiOperation({ summary: 'Listar colaboradores (filtrado por gestor)' })
  @ApiQuery({ name: 'empresaId', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, enum: ['ativo', 'inativo'] })
  async handle(
    @Query(new ZodValidationPipe(listColaboradoresQuerySchema))
    query: ListColaboradoresQuery,
    @CurrentUser() user: JwtPayload,
  ) {
    const result = await this.listColaboradores.execute({
      userId: user.userId,
      empresaId: query.empresaId,
      status: query.status,
    })
    return result.value
  }
}
