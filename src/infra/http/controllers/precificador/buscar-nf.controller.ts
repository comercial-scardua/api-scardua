import { Controller, Get, HttpCode, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { BuscarNfUseCase } from '../../../../domain/precificador/application/use-cases/buscar-nf'

@ApiTags('Precificador')
@ApiBearerAuth()
@Controller('/precificador')
@UseGuards(PermissionsGuard)
export class BuscarNfController {
  constructor(private buscarNf: BuscarNfUseCase) {}

  @Get('buscar-nf')
  @HttpCode(200)
  @RequirePermission('precificador', 'access')
  @ApiOperation({ summary: 'Buscar nota fiscal (stock_entries)' })
  @ApiQuery({ name: 'nf', required: false, type: String })
  @ApiQuery({ name: 'fornecedor', required: false, type: String })
  async handle(
    @Query('nf') nf?: string,
    @Query('fornecedor') fornecedor?: string,
  ) {
    const result = await this.buscarNf.execute(nf, fornecedor)
    return result.value
  }
}
