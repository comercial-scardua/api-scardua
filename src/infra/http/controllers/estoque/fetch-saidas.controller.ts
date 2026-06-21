import { Controller, Get, HttpCode, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { FetchSaidasUseCase } from '../../../../domain/estoque/application/use-cases/fetch-saidas'

@ApiTags('Estoque')
@ApiBearerAuth()
@Controller('/estoque')
@UseGuards(PermissionsGuard)
export class FetchSaidasController {
  constructor(private fetchSaidas: FetchSaidasUseCase) {}

  @Get('saidas')
  @HttpCode(200)
  @RequirePermission('estoque', 'access')
  @ApiOperation({ summary: 'Listar saídas com filtros' })
  @ApiQuery({ name: 'produtoId', required: false, type: Number })
  @ApiQuery({ name: 'responsavel', required: false })
  @ApiQuery({ name: 'motivo', required: false })
  @ApiQuery({ name: 'dataInicio', required: false })
  @ApiQuery({ name: 'dataFim', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async handle(
    @Query('produtoId') produtoId?: number,
    @Query('responsavel') responsavel?: string,
    @Query('motivo') motivo?: string,
    @Query('dataInicio') dataInicio?: string,
    @Query('dataFim') dataFim?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const result = await this.fetchSaidas.execute({
      produtoId,
      responsavel,
      motivo,
      dataInicio,
      dataFim,
      page,
      limit,
    })
    return result.value
  }
}
