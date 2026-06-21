import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { EpiRepository } from '../../../../domain/epi/application/repositories/epi-repository'

@ApiTags('EPI')
@ApiBearerAuth()
@Controller('/epi')
@UseGuards(PermissionsGuard)
export class GetAlertasController {
  constructor(private repo: EpiRepository) {}

  @Get('alertas')
  @RequirePermission('epi', 'access')
  @ApiOperation({
    summary: 'Alertas: entregas vencidas, próximas e estoque baixo',
  })
  @ApiQuery({ name: 'empresaId', required: false, type: Number })
  handle(@Query('empresaId') empresaId?: string) {
    return this.repo.findAlertas(empresaId ? Number(empresaId) : undefined)
  }
}
