import { Controller, Get, HttpCode, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { BuscarFornecedorUseCase } from '../../../../domain/precificador/application/use-cases/buscar-fornecedor'

@ApiTags('Precificador')
@ApiBearerAuth()
@Controller('/precificador')
@UseGuards(PermissionsGuard)
export class BuscarFornecedorController {
  constructor(private buscarFornecedor: BuscarFornecedorUseCase) {}

  @Get('buscar-fornecedor')
  @HttpCode(200)
  @RequirePermission('precificador', 'access')
  @ApiOperation({
    summary:
      'Buscar por fornecedor (empresaNome no histórico de precificações)',
  })
  @ApiQuery({ name: 'fornecedor', required: false, type: String })
  async handle(@Query('fornecedor') fornecedor?: string) {
    const result = await this.buscarFornecedor.execute(fornecedor)
    return result.value
  }
}
