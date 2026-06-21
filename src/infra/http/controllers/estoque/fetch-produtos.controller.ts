import { Controller, Get, HttpCode, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { FetchProdutosUseCase } from '../../../../domain/estoque/application/use-cases/fetch-produtos'

@ApiTags('Estoque')
@ApiBearerAuth()
@Controller('/estoque')
@UseGuards(PermissionsGuard)
export class FetchProdutosController {
  constructor(private fetchProdutos: FetchProdutosUseCase) {}

  @Get('produtos')
  @HttpCode(200)
  @RequirePermission('estoque', 'access')
  @ApiOperation({ summary: 'Listar produtos com paginação e filtros' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'categoria', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async handle(
    @Query('search') search?: string,
    @Query('categoria') categoria?: string,
    @Query('status') status?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const result = await this.fetchProdutos.execute({
      search,
      categoria,
      status,
      page,
      limit,
    })
    return result.value
  }
}
