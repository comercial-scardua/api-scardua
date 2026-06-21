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
import { ExcluirEntradaUseCase } from '../../../../domain/estoque/application/use-cases/excluir-entrada'

@ApiTags('Estoque')
@ApiBearerAuth()
@Controller('/estoque')
@UseGuards(PermissionsGuard)
export class DeleteEntradaController {
  constructor(private excluirEntrada: ExcluirEntradaUseCase) {}

  @Delete('entradas/:id')
  @HttpCode(204)
  @RequirePermission('estoque', 'edit')
  @ApiOperation({ summary: 'Excluir entrada (reverte estoqueAtual)' })
  async handle(@Param('id', ParseIntPipe) id: number) {
    const result = await this.excluirEntrada.execute(id)
    if (result.isLeft()) throw new NotFoundException(result.value.message)
  }
}
