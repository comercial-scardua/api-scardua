import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { z } from 'zod'
import { CurrentUser } from '../../../../auth/decorators/current-user.decorator'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import type { JwtPayload } from '../../../../auth/types/jwt-payload.type'
import { CriarProdutoUseCase } from '../../../../domain/estoque/application/use-cases/criar-produto'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const criarProdutoSchema = z.object({
  codigoInterno: z.string().min(1),
  nome: z.string().min(1),
  categoria: z.string().min(1),
  unidade: z.string().min(1),
  descricao: z.string().optional(),
  estoqueMinimo: z.number().int().min(0).default(0),
  status: z.enum(['ATIVO', 'INATIVO']).default('ATIVO'),
})

type CriarProdutoBody = z.infer<typeof criarProdutoSchema>

@ApiTags('Estoque')
@ApiBearerAuth()
@Controller('/estoque')
@UseGuards(PermissionsGuard)
export class CreateProdutoController {
  constructor(private criarProduto: CriarProdutoUseCase) {}

  @Post('produtos')
  @HttpCode(201)
  @RequirePermission('estoque', 'edit')
  @ApiOperation({ summary: 'Criar produto (código interno único)' })
  @UsePipes(new ZodValidationPipe(criarProdutoSchema))
  async handle(
    @Body() body: CriarProdutoBody,
    @CurrentUser() user: JwtPayload,
  ) {
    const result = await this.criarProduto.execute(body, user.userId)

    if (result.isLeft()) {
      throw new ConflictException(result.value.message)
    }

    return result.value.produto
  }
}
