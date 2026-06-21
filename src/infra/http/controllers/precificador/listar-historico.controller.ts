import { Controller, Get, HttpCode, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { ListarHistoricoUseCase } from '../../../../domain/precificador/application/use-cases/listar-historico'

@ApiTags('Precificador')
@ApiBearerAuth()
@Controller('/precificador')
@UseGuards(PermissionsGuard)
export class ListarHistoricoController {
  constructor(private listarHistorico: ListarHistoricoUseCase) {}

  @Get('historico')
  @HttpCode(200)
  @RequirePermission('precificador', 'access')
  @ApiOperation({ summary: 'Histórico de precificações' })
  @ApiQuery({ name: 'produtoId', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async handle(
    @Query('produtoId') produtoId?: string,
    @Query('page') page = '1',
    @Query('limit') limit = '20',
  ) {
    const result = await this.listarHistorico.execute(
      produtoId ? parseInt(produtoId) : undefined,
      parseInt(page) || 1,
      parseInt(limit) || 20,
    )
    return result.value
  }
}
