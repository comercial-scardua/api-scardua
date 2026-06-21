import {
  Body,
  Controller,
  Delete,
  HttpCode,
  UseGuards,
  UsePipes,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { z } from 'zod'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { LimparHistoricoTabelaPrecoUseCase } from '../../../../domain/tabela-de-preco/application/use-cases/limpar-historico-tabela-preco'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const limparHistoricoBodySchema = z.object({
  ids: z.array(z.number().int().positive()).optional(),
})

type LimparHistoricoBody = z.infer<typeof limparHistoricoBodySchema>

@ApiTags('Tabela de Preço')
@ApiBearerAuth()
@Controller('/tabela-de-preco')
@UseGuards(PermissionsGuard)
export class LimparHistoricoTabelaPrecoController {
  constructor(private limparHistorico: LimparHistoricoTabelaPrecoUseCase) {}

  @Delete('historico')
  @HttpCode(200)
  @RequirePermission('tabela-de-preco', 'edit')
  @ApiOperation({
    summary: 'Limpar histórico de importações (body: { ids?: number[] })',
  })
  @UsePipes(new ZodValidationPipe(limparHistoricoBodySchema))
  async handle(@Body() body: LimparHistoricoBody) {
    const result = await this.limparHistorico.execute({
      ids: body.ids,
    })

    return result.value
  }
}
