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
import { ExcluirSaidaUseCase } from '../../../../domain/estoque/application/use-cases/excluir-saida'

@ApiTags('Estoque')
@ApiBearerAuth()
@Controller('/estoque')
@UseGuards(PermissionsGuard)
export class DeleteSaidaController {
  constructor(private excluirSaida: ExcluirSaidaUseCase) {}

  @Delete('saidas/:id')
  @HttpCode(204)
  @RequirePermission('estoque', 'edit')
  @ApiOperation({ summary: 'Excluir saída (reverte estoqueAtual)' })
  async handle(@Param('id', ParseIntPipe) id: number) {
    const result = await this.excluirSaida.execute(id)
    if (result.isLeft()) throw new NotFoundException(result.value.message)
  }
}
