import { Controller, Get, HttpCode, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { ObterDashboardUseCase } from '../../../../domain/sgq/application/use-cases/obter-dashboard'

@ApiTags('SGQ')
@ApiBearerAuth()
@Controller('/sgq')
@UseGuards(PermissionsGuard)
export class ObterDashboardController {
  constructor(private obterDashboard: ObterDashboardUseCase) {}

  @Get('dashboard')
  @HttpCode(200)
  @RequirePermission('sgq', 'access')
  @ApiOperation({ summary: 'Dashboard SGQ com estatisticas agregadas' })
  async handle() {
    return this.obterDashboard.execute()
  }
}
