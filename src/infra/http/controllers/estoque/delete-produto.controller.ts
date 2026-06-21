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
import { DesativarProdutoUseCase } from '../../../../domain/estoque/application/use-cases/desativar-produto'

@ApiTags('Estoque')
@ApiBearerAuth()
@Controller('/estoque')
@UseGuards(PermissionsGuard)
export class DeleteProdutoController {
  constructor(private desativarProduto: DesativarProdutoUseCase) {}

  @Delete('produtos/:id')
  @HttpCode(204)
  @RequirePermission('estoque', 'edit')
  @ApiOperation({ summary: 'Desativar produto (status = INATIVO)' })
  async handle(@Param('id', ParseIntPipe) id: number) {
    const result = await this.desativarProduto.execute(id)
    if (result.isLeft()) throw new NotFoundException(result.value.message)
  }
}
