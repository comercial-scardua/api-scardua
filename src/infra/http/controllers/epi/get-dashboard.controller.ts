import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { EpiRepository } from '../../../../domain/epi/application/repositories/epi-repository'

@ApiTags('EPI')
@ApiBearerAuth()
@Controller('/epi')
@UseGuards(PermissionsGuard)
export class GetDashboardController {
  constructor(private repo: EpiRepository) {}

  @Get('dashboard')
  @RequirePermission('epi', 'access')
  @ApiOperation({ summary: 'Dados do dashboard EPI' })
  @ApiQuery({ name: 'empresaId', required: false, type: Number })
  handle(@Query('empresaId') empresaId?: string) {
    return this.repo.findDashboard(empresaId ? Number(empresaId) : undefined)
  }
}
