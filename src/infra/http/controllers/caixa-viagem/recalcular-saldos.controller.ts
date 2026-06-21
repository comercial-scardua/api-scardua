import { Controller, HttpCode, Post, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { RecalcularSaldosCaixaViagemUseCase } from '../../../../domain/caixa-viagem/application/use-cases/recalcular-saldos-caixa-viagem'

@ApiTags('Caixa Viagem')
@ApiBearerAuth()
@Controller('/caixaviagem')
@UseGuards(PermissionsGuard)
export class RecalcularSaldosController {
  constructor(
    private recalcularSaldosCaixaViagem: RecalcularSaldosCaixaViagemUseCase,
  ) {}

  @Post('recalcularSaldos')
  @HttpCode(200)
  @RequirePermission('caixaviagem', 'edit')
  @ApiOperation({
    summary: 'Recalcular saldoAnterior de todos os caixas de viagem',
  })
  async handle() {
    const result = await this.recalcularSaldosCaixaViagem.execute()
    return result.value!
  }
}
