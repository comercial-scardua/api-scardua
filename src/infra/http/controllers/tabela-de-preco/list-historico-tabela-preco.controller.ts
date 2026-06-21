import { Controller, Get, HttpCode, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { ListHistoricoTabelaPrecoUseCase } from '../../../../domain/tabela-de-preco/application/use-cases/list-historico-tabela-preco'

@ApiTags('Tabela de Preço')
@ApiBearerAuth()
@Controller('/tabela-de-preco')
@UseGuards(PermissionsGuard)
export class ListHistoricoTabelaPrecoController {
  constructor(private listHistorico: ListHistoricoTabelaPrecoUseCase) {}

  @Get('historico')
  @HttpCode(200)
  @RequirePermission('tabela-de-preco', 'access')
  @ApiOperation({
    summary: 'Listar histórico de importações de tabela de preços',
  })
  @ApiQuery({ name: 'empresaId', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async handle(
    @Query('empresaId') empresaId?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const result = await this.listHistorico.execute({
      empresaId: empresaId ? Number.parseInt(empresaId, 10) : undefined,
      page: page ? Number.parseInt(page, 10) || 1 : undefined,
      limit: limit ? Number.parseInt(limit, 10) || 20 : undefined,
    })

    return result.value
  }
}
