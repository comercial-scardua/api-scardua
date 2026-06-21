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
import { ImportarTabelaPrecoUseCase } from '../../../../domain/tabela-de-preco/application/use-cases/importar-tabela-preco'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const tabelaPrecoItemSchema = z.object({
  produtoCodigo: z.string().min(1),
  produtoNome: z.string().min(1),
  precoVenda: z.number().positive(),
  precoBase: z.number().positive().optional(),
  observacao: z.string().optional().nullable(),
})

const importarTabelaPrecoBodySchema = z.object({
  empresaId: z.number().int().positive(),
  empresaNome: z.string().min(1),
  itens: z.array(tabelaPrecoItemSchema).min(1),
})

type ImportarTabelaPrecoBody = z.infer<typeof importarTabelaPrecoBodySchema>

@ApiTags('Tabela de Preço')
@ApiBearerAuth()
@Controller('/tabela-de-preco')
@UseGuards(PermissionsGuard)
export class ImportarTabelaPrecoController {
  constructor(private importarTabelaPreco: ImportarTabelaPrecoUseCase) {}

  @Post('importar')
  @HttpCode(201)
  @RequirePermission('tabela-de-preco', 'edit')
  @ApiOperation({
    summary: 'Importar tabela de preços (array de produtos+preços)',
  })
  @UsePipes(new ZodValidationPipe(importarTabelaPrecoBodySchema))
  async handle(
    @Body() body: ImportarTabelaPrecoBody,
    @CurrentUser() user: JwtPayload,
  ) {
    const result = await this.importarTabelaPreco.execute({
      userId: user.userId,
      empresaId: body.empresaId,
      empresaNome: body.empresaNome,
      itens: body.itens,
    })

    return result.value
  }
}
