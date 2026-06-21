import { Controller, Get, HttpCode, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { ListMonitorRegistrosUseCase } from '../../../../domain/monitor-registros/application/use-cases/list-monitor-registros'

@ApiTags('Monitor Registros')
@ApiBearerAuth()
@Controller('/monitor-registros')
@UseGuards(PermissionsGuard)
export class ListMonitorRegistrosController {
  constructor(private listMonitorRegistros: ListMonitorRegistrosUseCase) {}

  @Get()
  @HttpCode(200)
  @RequirePermission('monitor-registros', 'access')
  @ApiOperation({ summary: 'Listar registros recentes para monitoramento' })
  @ApiQuery({ name: 'colaboradorId', required: false, type: Number })
  @ApiQuery({ name: 'dataInicio', required: false })
  @ApiQuery({ name: 'dataFim', required: false })
  @ApiQuery({ name: 'tipo', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async handle(
    @Query('colaboradorId') colaboradorId?: string,
    @Query('dataInicio') dataInicio?: string,
    @Query('dataFim') dataFim?: string,
    @Query('tipo') tipo?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const result = await this.listMonitorRegistros.execute({
      colaboradorId: colaboradorId
        ? Number.parseInt(colaboradorId, 10)
        : undefined,
      dataInicio,
      dataFim,
      tipo,
      page: page ? Number.parseInt(page, 10) : undefined,
      limit: limit ? Number.parseInt(limit, 10) : undefined,
    })

    return result.value
  }
}
