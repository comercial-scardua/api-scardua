import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { EpiRepository } from '../../../../domain/epi/application/repositories/epi-repository'

@ApiTags('EPI')
@ApiBearerAuth()
@Controller('/epi')
@UseGuards(PermissionsGuard)
export class FindAllEpisController {
  constructor(private repo: EpiRepository) {}

  @Get('epis')
  @RequirePermission('epi', 'access')
  @ApiOperation({ summary: 'Listar EPIs' })
  @ApiQuery({ name: 'categoria', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'baixo_estoque', required: false, type: Boolean })
  handle(
    @Query('categoria') categoria?: string,
    @Query('status') status?: string,
    @Query('search') search?: string,
    @Query('baixo_estoque') baixoEstoque?: string,
  ) {
    return this.repo.findAllEpis({
      categoria,
      status,
      search,
      baixo_estoque: baixoEstoque === 'true',
    })
  }
}
