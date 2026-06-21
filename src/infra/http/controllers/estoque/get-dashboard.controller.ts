import { Controller, Get, HttpCode, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { GetDashboardUseCase } from '../../../../domain/estoque/application/use-cases/get-dashboard'

@ApiTags('Estoque')
@ApiBearerAuth()
@Controller('/estoque')
@UseGuards(PermissionsGuard)
export class GetDashboardController {
  constructor(private getDashboard: GetDashboardUseCase) {}

  @Get('dashboard')
  @HttpCode(200)
  @RequirePermission('estoque', 'access')
  @ApiOperation({ summary: 'Métricas do mês corrente' })
  async handle() {
    const result = await this.getDashboard.execute()
    return result.value
  }
}
