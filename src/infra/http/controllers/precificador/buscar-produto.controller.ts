import { Controller, Get, HttpCode, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { BuscarProdutoUseCase } from '../../../../domain/precificador/application/use-cases/buscar-produto'

@ApiTags('Precificador')
@ApiBearerAuth()
@Controller('/precificador')
@UseGuards(PermissionsGuard)
export class BuscarProdutoController {
  constructor(private buscarProduto: BuscarProdutoUseCase) {}

  @Get('buscar-produto')
  @HttpCode(200)
  @RequirePermission('precificador', 'access')
  @ApiOperation({ summary: 'Buscar produto por código ou nome' })
  @ApiQuery({ name: 'q', required: false, type: String })
  @ApiQuery({ name: 'codigo', required: false, type: String })
  async handle(@Query('q') q?: string, @Query('codigo') codigo?: string) {
    const result = await this.buscarProduto.execute(q, codigo)
    return result.value
  }
}
