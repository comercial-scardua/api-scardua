import { Controller, Get, HttpCode, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { FetchEntradasUseCase } from '../../../../domain/estoque/application/use-cases/fetch-entradas'

@ApiTags('Estoque')
@ApiBearerAuth()
@Controller('/estoque')
@UseGuards(PermissionsGuard)
export class FetchEntradasController {
  constructor(private fetchEntradas: FetchEntradasUseCase) {}

  @Get('entradas')
  @HttpCode(200)
  @RequirePermission('estoque', 'access')
  @ApiOperation({ summary: 'Listar entradas com filtros' })
  @ApiQuery({ name: 'produtoId', required: false, type: Number })
  @ApiQuery({ name: 'numeroNotaFiscal', required: false })
  @ApiQuery({ name: 'dataInicio', required: false })
  @ApiQuery({ name: 'dataFim', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async handle(
    @Query('produtoId') produtoId?: number,
    @Query('numeroNotaFiscal') numeroNotaFiscal?: string,
    @Query('dataInicio') dataInicio?: string,
    @Query('dataFim') dataFim?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const result = await this.fetchEntradas.execute({
      produtoId,
      numeroNotaFiscal,
      dataInicio,
      dataFim,
      page,
      limit,
    })
    return result.value
  }
}
