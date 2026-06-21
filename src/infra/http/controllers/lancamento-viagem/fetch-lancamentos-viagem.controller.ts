import { Controller, Get, HttpCode, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { FetchLancamentosViagemUseCase } from '../../../../domain/lancamento-viagem/application/use-cases/fetch-lancamentos-viagem'

@ApiTags('Lancamento Viagem')
@ApiBearerAuth()
@Controller('/lancamentoviagem')
@UseGuards(PermissionsGuard)
export class FetchLancamentosViagemController {
  constructor(private fetchLancamentosViagem: FetchLancamentosViagemUseCase) {}

  @Get()
  @HttpCode(200)
  @RequirePermission('lancamentoviagem', 'access')
  @ApiOperation({ summary: 'Listar lançamentos de viagem' })
  @ApiQuery({ name: 'caixaViagemId', required: false, type: Number })
  @ApiQuery({ name: 'tipo', required: false })
  @ApiQuery({ name: 'userId', required: false })
  async handle(
    @Query('caixaViagemId') caixaViagemId?: string,
    @Query('tipo') tipo?: string,
    @Query('userId') userId?: string,
  ) {
    const result = await this.fetchLancamentosViagem.execute({
      filters: {
        caixaId: caixaViagemId ? Number.parseInt(caixaViagemId, 10) : undefined,
        tipo,
        userId,
      },
    })

    return result.value.lancamentos
  }
}
