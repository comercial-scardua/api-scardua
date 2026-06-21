import {
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { GetProdutoUseCase } from '../../../../domain/estoque/application/use-cases/get-produto'

@ApiTags('Estoque')
@ApiBearerAuth()
@Controller('/estoque')
@UseGuards(PermissionsGuard)
export class GetProdutoController {
  constructor(private getProduto: GetProdutoUseCase) {}

  @Get('produtos/:id')
  @HttpCode(200)
  @RequirePermission('estoque', 'access')
  @ApiOperation({ summary: 'Buscar produto por ID' })
  async handle(@Param('id', ParseIntPipe) id: number) {
    const result = await this.getProduto.execute(id)
    if (result.isLeft()) throw new NotFoundException(result.value.message)
    return result.value.produto
  }
}
