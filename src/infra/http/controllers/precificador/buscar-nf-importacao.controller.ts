import { Controller, Get, HttpCode, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { BuscarNfImportacaoUseCase } from '../../../../domain/precificador/application/use-cases/buscar-nf-importacao'

@ApiTags('Precificador')
@ApiBearerAuth()
@Controller('/precificador')
@UseGuards(PermissionsGuard)
export class BuscarNfImportacaoController {
  constructor(private buscarNfImportacao: BuscarNfImportacaoUseCase) {}

  @Get('buscar-nf-importacao')
  @HttpCode(200)
  @RequirePermission('precificador', 'access')
  @ApiOperation({ summary: 'Buscar NF de importação (stock_entries)' })
  @ApiQuery({ name: 'nf', required: false, type: String })
  async handle(@Query('nf') nf?: string) {
    const result = await this.buscarNfImportacao.execute(nf)
    return result.value
  }
}
