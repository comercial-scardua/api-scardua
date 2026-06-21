import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { RemoveLancamentosByContaUseCase } from '../../../../domain/lancamento/application/use-cases/remove-lancamentos-by-conta'

@ApiTags('Lancamento')
@ApiBearerAuth()
@Controller('/lancamento')
@UseGuards(PermissionsGuard)
export class RemoveLancamentosByContaController {
  constructor(
    private removeLancamentosByConta: RemoveLancamentosByContaUseCase,
  ) {}

  @Delete()
  @HttpCode(200)
  @RequirePermission('lancamento', 'edit')
  @ApiOperation({
    summary: 'Excluir todos os lançamentos de uma conta corrente',
  })
  @ApiQuery({ name: 'contaCorrenteId', required: true, type: String })
  async handle(@Query('contaCorrenteId') contaCorrenteId: string) {
    if (!contaCorrenteId) {
      throw new BadRequestException('contaCorrenteId é obrigatório')
    }

    const result = await this.removeLancamentosByConta.execute({
      contaCorrenteId: Number.parseInt(contaCorrenteId, 10),
    })

    return {
      success: true,
      message: `${result.value.deleted} lançamento(s) excluído(s)`,
    }
  }
}
