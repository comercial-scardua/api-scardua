import { Controller, Get, HttpCode, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { ListarUltimosEventosUseCase } from '../../../../domain/suporte/application/use-cases/listar-ultimos-eventos'

@ApiTags('Suporte')
@ApiBearerAuth()
@Controller('/suporte')
@UseGuards(PermissionsGuard)
export class ListarUltimosEventosController {
  constructor(private listarUltimosEventos: ListarUltimosEventosUseCase) {}

  @Get('comentarios/novos')
  @HttpCode(200)
  @RequirePermission('suporte', 'access')
  @ApiOperation({ summary: 'Listar últimos 20 eventos de todos os tickets' })
  async handle() {
    const result = await this.listarUltimosEventos.execute()
    return result.value
  }
}
