import { Controller, Get, HttpCode, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { GetSaldoFiliaisUseCase } from '../../../../domain/estoque/application/use-cases/get-saldo-filiais'

@ApiTags('Estoque')
@ApiBearerAuth()
@Controller('/estoque')
@UseGuards(PermissionsGuard)
export class GetSaldoFiliaisController {
  constructor(private getSaldoFiliais: GetSaldoFiliaisUseCase) {}

  @Get('saldo-filiais')
  @HttpCode(200)
  @RequirePermission('estoque', 'access')
  @ApiOperation({ summary: 'Matriz de saldos produto x empresa (SQL raw)' })
  @ApiQuery({ name: 'produtoId', required: false, type: Number })
  @ApiQuery({ name: 'empresaId', required: false, type: Number })
  async handle(
    @Query('produtoId') produtoId?: number,
    @Query('empresaId') empresaId?: number,
  ) {
    const result = await this.getSaldoFiliais.execute(produtoId, empresaId)
    return result.value
  }
}
