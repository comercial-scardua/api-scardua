import {
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { AtualizarProdutoUseCase } from '../../../../domain/estoque/application/use-cases/atualizar-produto'

@ApiTags('Estoque')
@ApiBearerAuth()
@Controller('/estoque')
@UseGuards(PermissionsGuard)
export class UpdateProdutoController {
  constructor(private atualizarProduto: AtualizarProdutoUseCase) {}

  @Put('produtos/:id')
  @HttpCode(200)
  @RequirePermission('estoque', 'edit')
  @ApiOperation({ summary: 'Atualizar produto' })
  async handle(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: Record<string, unknown>,
  ) {
    const result = await this.atualizarProduto.execute(id, body)
    if (result.isLeft()) throw new NotFoundException(result.value.message)
    return result.value.produto
  }

  @Post('produtos/:id')
  @HttpCode(200)
  @RequirePermission('estoque', 'edit')
  @ApiOperation({ summary: 'Atualizar produto (POST alias para PUT)' })
  async handlePost(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: Record<string, unknown>,
  ) {
    const result = await this.atualizarProduto.execute(id, body)
    if (result.isLeft()) throw new NotFoundException(result.value.message)
    return result.value.produto
  }
}
