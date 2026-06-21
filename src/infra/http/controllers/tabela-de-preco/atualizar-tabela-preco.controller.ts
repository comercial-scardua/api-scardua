import {
  Body,
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
import { AtualizarTabelaPrecoUseCase } from '../../../../domain/tabela-de-preco/application/use-cases/atualizar-tabela-preco'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const tabelaPrecoItemSchema = z.object({
  produtoCodigo: z.string().min(1),
  produtoNome: z.string().min(1),
  precoVenda: z.number().positive(),
  precoBase: z.number().positive().optional(),
  observacao: z.string().optional().nullable(),
})

const atualizarTabelaPrecoBodySchema = z.object({
  empresaId: z.number().int().positive().optional(),
  empresaNome: z.string().optional(),
  descricao: z.string().optional().nullable(),
  itens: z.array(tabelaPrecoItemSchema).optional(),
})

type AtualizarTabelaPrecoBody = z.infer<typeof atualizarTabelaPrecoBodySchema>

@ApiTags('Tabela de Preço')
@ApiBearerAuth()
@Controller('/tabela-de-preco')
@UseGuards(PermissionsGuard)
export class AtualizarTabelaPrecoController {
  constructor(private atualizarTabelaPreco: AtualizarTabelaPrecoUseCase) {}

  @Post('atualizar')
  @HttpCode(200)
  @RequirePermission('tabela-de-preco', 'edit')
  @ApiOperation({
    summary: 'Atualizar tabela existente (insere novos registros como revisão)',
  })
  @UsePipes(new ZodValidationPipe(atualizarTabelaPrecoBodySchema))
  async handle(
    @Body() body: AtualizarTabelaPrecoBody,
    @CurrentUser() user: JwtPayload,
  ) {
    const result = await this.atualizarTabelaPreco.execute({
      userId: user.userId,
      empresaId: body.empresaId,
      empresaNome: body.empresaNome,
      descricao: body.descricao,
      itens: body.itens,
    })

    return result.value
  }
}
