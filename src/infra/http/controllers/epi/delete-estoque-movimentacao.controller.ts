import {
  Controller,
  Delete,
  HttpCode,
  NotFoundException,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { ExcluirEstoqueMovimentacaoUseCase } from '../../../../domain/epi/application/use-cases/excluir-estoque-movimentacao'

@ApiTags('EPI')
@ApiBearerAuth()
@Controller('/epi')
@UseGuards(PermissionsGuard)
export class DeleteEstoqueMovimentacaoController {
  constructor(
    private excluirEstoqueMovimentacao: ExcluirEstoqueMovimentacaoUseCase,
  ) {}

  @Delete('estoque/:id')
  @HttpCode(204)
  @RequirePermission('epi', 'edit')
  @ApiOperation({
    summary: 'Deletar movimentação de estoque (reverte o estoque)',
  })
  async handle(@Param('id', ParseIntPipe) id: number) {
    const result = await this.excluirEstoqueMovimentacao.execute(id)
    if (result.isLeft()) throw new NotFoundException(result.value.message)
  }
}
