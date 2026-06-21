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
import { ExcluirAdiantamentoUseCase } from '../../../../domain/caixa-viagem/application/use-cases/excluir-adiantamento'

@ApiTags('Caixa Viagem')
@ApiBearerAuth()
@Controller('/caixaviagem')
@UseGuards(PermissionsGuard)
export class ExcluirAdiantamentoController {
  constructor(private excluirAdiantamento: ExcluirAdiantamentoUseCase) {}

  @Delete('adiantamento/:id')
  @HttpCode(204)
  @RequirePermission('caixaviagem', 'edit')
  @ApiOperation({ summary: 'Excluir adiantamento' })
  async handle(@Param('id', ParseIntPipe) id: number) {
    const result = await this.excluirAdiantamento.execute({ id })

    if (result.isLeft()) {
      throw new NotFoundException(result.value.message)
    }
  }
}
