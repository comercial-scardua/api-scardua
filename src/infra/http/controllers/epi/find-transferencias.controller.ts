import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { EpiRepository } from '../../../../domain/epi/application/repositories/epi-repository'

@ApiTags('EPI')
@ApiBearerAuth()
@Controller('/epi')
@UseGuards(PermissionsGuard)
export class FindTransferenciasController {
  constructor(private repo: EpiRepository) {}

  @Get('transferencias')
  @RequirePermission('epi', 'access')
  @ApiOperation({ summary: 'Listar transferências entre filiais' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'dataInicio', required: false })
  @ApiQuery({ name: 'dataFim', required: false })
  handle(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('dataInicio') dataInicio?: string,
    @Query('dataFim') dataFim?: string,
  ) {
    return this.repo.findTransferencias({
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 20,
      dataInicio,
      dataFim,
    })
  }
}
