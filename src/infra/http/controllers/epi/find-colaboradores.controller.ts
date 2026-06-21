import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { CurrentUser } from '../../../../auth/decorators/current-user.decorator'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import type { JwtPayload } from '../../../../auth/types/jwt-payload.type'
import { ListarColaboradoresEpiUseCase } from '../../../../domain/epi/application/use-cases/listar-colaboradores-epi'

@ApiTags('EPI')
@ApiBearerAuth()
@Controller('/epi')
@UseGuards(PermissionsGuard)
export class FindColaboradoresController {
  constructor(private listarColaboradores: ListarColaboradoresEpiUseCase) {}

  @Get('colaboradores')
  @RequirePermission('epi', 'access')
  @ApiOperation({ summary: 'Listar colaboradores no contexto EPI' })
  @ApiQuery({ name: 'empresaId', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false })
  async handle(
    @CurrentUser() user: JwtPayload,
    @Query('empresaId') empresaId?: string,
    @Query('status') status?: string,
  ) {
    const result = await this.listarColaboradores.execute(user, {
      empresaId: empresaId ? Number(empresaId) : undefined,
      status,
    })
    return result.value.colaboradores
  }
}
