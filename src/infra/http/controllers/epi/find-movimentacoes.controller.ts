import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { EpiRepository } from '../../../../domain/epi/application/repositories/epi-repository'

@ApiTags('EPI')
@ApiBearerAuth()
@Controller('/epi')
@UseGuards(PermissionsGuard)
export class FindMovimentacoesController {
  constructor(private repo: EpiRepository) {}

  @Get('movimentacoes')
  @RequirePermission('epi', 'access')
  @ApiOperation({ summary: 'Listar movimentações' })
  @ApiQuery({ name: 'colaborador_id', required: false, type: Number })
  @ApiQuery({ name: 'epi_id', required: false, type: Number })
  @ApiQuery({ name: 'tipo', required: false })
  @ApiQuery({ name: 'empresaId', required: false, type: Number })
  handle(
    @Query('colaborador_id') colaboradorId?: string,
    @Query('epi_id') epiId?: string,
    @Query('tipo') tipo?: string,
    @Query('empresaId') empresaId?: string,
  ) {
    return this.repo.findMovimentacoes({
      colaborador_id: colaboradorId ? Number(colaboradorId) : undefined,
      epi_id: epiId ? Number(epiId) : undefined,
      tipo,
      empresaId: empresaId ? Number(empresaId) : undefined,
    })
  }
}
