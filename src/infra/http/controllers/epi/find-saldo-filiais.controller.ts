import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { EpiRepository } from '../../../../domain/epi/application/repositories/epi-repository'

@ApiTags('EPI')
@ApiBearerAuth()
@Controller('/epi')
@UseGuards(PermissionsGuard)
export class FindSaldoFiliaisController {
  constructor(private repo: EpiRepository) {}

  @Get('saldo-filiais')
  @RequirePermission('epi', 'access')
  @ApiOperation({ summary: 'Saldo de EPIs por filial' })
  @ApiQuery({ name: 'empresaId', required: false, type: Number })
  handle(@Query('empresaId') empresaId?: string) {
    return this.repo.findSaldoFiliais(empresaId ? Number(empresaId) : undefined)
  }
}
