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
import { IncluirTabelaPrecoUseCase } from '../../../../domain/tabela-de-preco/application/use-cases/incluir-tabela-preco'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const tabelaPrecoItemSchema = z.object({
  produtoCodigo: z.string().min(1),
  produtoNome: z.string().min(1),
  precoVenda: z.number().positive(),
  precoBase: z.number().positive().optional(),
  observacao: z.string().optional().nullable(),
})

const incluirTabelaPrecoBodySchema = z.object({
  empresaId: z.number().int().positive(),
  empresaNome: z.string().min(1),
  descricao: z.string().optional().nullable(),
  itens: z.array(tabelaPrecoItemSchema).min(1),
})

type IncluirTabelaPrecoBody = z.infer<typeof incluirTabelaPrecoBodySchema>

@ApiTags('Tabela de Preço')
@ApiBearerAuth()
@Controller('/tabela-de-preco')
@UseGuards(PermissionsGuard)
export class IncluirTabelaPrecoController {
  constructor(private incluirTabelaPreco: IncluirTabelaPrecoUseCase) {}

  @Post('incluir')
  @HttpCode(201)
  @RequirePermission('tabela-de-preco', 'edit')
  @ApiOperation({
    summary:
      'Incluir nova tabela de preço (persiste itens como registros em precificador_historico)',
  })
  @UsePipes(new ZodValidationPipe(incluirTabelaPrecoBodySchema))
  async handle(
    @Body() body: IncluirTabelaPrecoBody,
    @CurrentUser() user: JwtPayload,
  ) {
    const result = await this.incluirTabelaPreco.execute({
      userId: user.userId,
      empresaId: body.empresaId,
      empresaNome: body.empresaNome,
      descricao: body.descricao,
      itens: body.itens,
    })

    return result.value
  }
}
