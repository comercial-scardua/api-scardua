import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { EpiRepository } from '../../../../domain/epi/application/repositories/epi-repository'

@ApiTags('EPI')
@ApiBearerAuth()
@Controller('/epi')
@UseGuards(PermissionsGuard)
export class FindEstoqueController {
  constructor(private repo: EpiRepository) {}

  @Get('estoque')
  @RequirePermission('epi', 'access')
  @ApiOperation({
    summary: 'EPIs com situação de estoque e histórico de movimentações',
  })
  @ApiQuery({ name: 'epi_id', required: false, type: Number })
  @ApiQuery({ name: 'empresaId', required: false, type: Number })
  handle(
    @Query('epi_id') epiId?: string,
    @Query('empresaId') empresaId?: string,
  ) {
    return this.repo.findEstoque({
      epi_id: epiId ? Number(epiId) : undefined,
      empresaId: empresaId ? Number(empresaId) : undefined,
    })
  }
}
