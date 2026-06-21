import { Controller, Get, HttpCode, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { FetchTransferenciasUseCase } from '../../../../domain/estoque/application/use-cases/fetch-transferencias'

@ApiTags('Estoque')
@ApiBearerAuth()
@Controller('/estoque')
@UseGuards(PermissionsGuard)
export class FetchTransferenciasController {
  constructor(private fetchTransferencias: FetchTransferenciasUseCase) {}

  @Get('transferencias')
  @HttpCode(200)
  @RequirePermission('estoque', 'access')
  @ApiOperation({ summary: 'Listar transferências com filtros' })
  @ApiQuery({ name: 'produtoId', required: false, type: Number })
  @ApiQuery({ name: 'empresaOrigemId', required: false, type: Number })
  @ApiQuery({ name: 'empresaDestinoId', required: false, type: Number })
  @ApiQuery({ name: 'dataInicio', required: false })
  @ApiQuery({ name: 'dataFim', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async handle(
    @Query('produtoId') produtoId?: number,
    @Query('empresaOrigemId') empresaOrigemId?: number,
    @Query('empresaDestinoId') empresaDestinoId?: number,
    @Query('dataInicio') dataInicio?: string,
    @Query('dataFim') dataFim?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const result = await this.fetchTransferencias.execute({
      produtoId,
      empresaOrigemId,
      empresaDestinoId,
      dataInicio,
      dataFim,
      page,
      limit,
    })
    return result.value
  }
}
