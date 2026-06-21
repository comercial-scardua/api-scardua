import {
  Controller,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { FetchLancamentosViagemByColaboradorUseCase } from '../../../../domain/lancamento-viagem/application/use-cases/fetch-lancamentos-viagem-by-colaborador'

@ApiTags('Lancamento Viagem')
@ApiBearerAuth()
@Controller('/lancamentoviagem')
@UseGuards(PermissionsGuard)
export class FetchLancamentosViagemByColaboradorController {
  constructor(
    private fetchByColaborador: FetchLancamentosViagemByColaboradorUseCase,
  ) {}

  @Get('usuario/:id')
  @HttpCode(200)
  @RequirePermission('lancamentoviagem', 'access')
  @ApiOperation({ summary: 'Listar lançamentos de viagem por colaboradorId' })
  async handle(@Param('id', ParseIntPipe) id: number) {
    const result = await this.fetchByColaborador.execute({
      colaboradorId: id,
    })

    return result.value.lancamentos
  }
}
