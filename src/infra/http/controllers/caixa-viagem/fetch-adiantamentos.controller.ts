import { Controller, Get, HttpCode, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { FetchAdiantamentosUseCase } from '../../../../domain/caixa-viagem/application/use-cases/fetch-adiantamentos'

@ApiTags('Caixa Viagem')
@ApiBearerAuth()
@Controller('/caixaviagem')
@UseGuards(PermissionsGuard)
export class FetchAdiantamentosController {
  constructor(private fetchAdiantamentos: FetchAdiantamentosUseCase) {}

  @Get('adiantamento')
  @HttpCode(200)
  @RequirePermission('caixaviagem', 'access')
  @ApiOperation({
    summary: 'Listar adiantamentos (filtros: caixaViagemId, colaboradorId)',
  })
  @ApiQuery({ name: 'caixaViagemId', required: false, type: Number })
  @ApiQuery({ name: 'colaboradorId', required: false, type: Number })
  async handle(
    @Query('caixaViagemId') caixaViagemId?: string,
    @Query('colaboradorId') colaboradorId?: string,
  ) {
    const result = await this.fetchAdiantamentos.execute({
      caixaViagemId: caixaViagemId
        ? Number.parseInt(caixaViagemId, 10)
        : undefined,
      colaboradorId: colaboradorId
        ? Number.parseInt(colaboradorId, 10)
        : undefined,
    })
    return result.value?.adiantamentos
  }
}
