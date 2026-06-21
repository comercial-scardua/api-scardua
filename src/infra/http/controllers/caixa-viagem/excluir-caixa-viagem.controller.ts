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
import { ExcluirCaixaViagemUseCase } from '../../../../domain/caixa-viagem/application/use-cases/excluir-caixa-viagem'

@ApiTags('Caixa Viagem')
@ApiBearerAuth()
@Controller('/caixaviagem')
@UseGuards(PermissionsGuard)
export class ExcluirCaixaViagemController {
  constructor(private excluirCaixaViagem: ExcluirCaixaViagemUseCase) {}

  @Delete(':id')
  @HttpCode(204)
  @RequirePermission('caixaviagem', 'edit')
  @ApiOperation({
    summary: 'Excluir caixa de viagem e seus lançamentos/adiantamentos',
  })
  async handle(@Param('id', ParseIntPipe) id: number) {
    const result = await this.excluirCaixaViagem.execute({ id })

    if (result.isLeft()) {
      throw new NotFoundException(result.value.message)
    }
  }
}
