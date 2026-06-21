import {
  Controller,
  Delete,
  HttpCode,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { ExcluirLancamentoContaUseCase } from '../../../../domain/conta-corrente/application/use-cases/excluir-lancamento-conta'

@ApiTags('Conta Corrente')
@ApiBearerAuth()
@Controller('/conta-corrente')
@UseGuards(PermissionsGuard)
export class ExcluirLancamentoController {
  constructor(private excluirLancamento: ExcluirLancamentoContaUseCase) {}

  @Delete(':id/lancamentos/:lancamentoId')
  @HttpCode(204)
  @RequirePermission('contacorrente', 'access')
  @ApiOperation({ summary: 'Excluir lançamento' })
  async handle(
    @Param('id', ParseIntPipe) _id: number,
    @Param('lancamentoId', ParseIntPipe) lancamentoId: number,
  ) {
    await this.excluirLancamento.execute({ lancamentoId })
  }
}
