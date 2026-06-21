import {
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { z } from 'zod'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { IncluirPrecoVendaUseCase } from '../../../../domain/preco-venda/application/use-cases/incluir-preco-venda'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const incluirPrecoVendaBodySchema = z.object({
  produtoId: z.number().int().positive(),
  precoVenda: z.number().positive(),
  observacao: z.string().optional().nullable(),
})

type IncluirPrecoVendaBody = z.infer<typeof incluirPrecoVendaBodySchema>

@ApiTags('Preco de Venda')
@ApiBearerAuth()
@Controller('/preco-venda')
@UseGuards(PermissionsGuard)
export class IncluirPrecoVendaController {
  constructor(private incluirPrecoVenda: IncluirPrecoVendaUseCase) {}

  @Post('incluir')
  @HttpCode(200)
  @RequirePermission('preco-venda', 'edit')
  @ApiOperation({ summary: 'Incluir/atualizar preço de venda de um produto' })
  @UsePipes(new ZodValidationPipe(incluirPrecoVendaBodySchema))
  async handle(@Body() body: IncluirPrecoVendaBody) {
    const result = await this.incluirPrecoVenda.execute({
      data: {
        produtoId: body.produtoId,
        precoVenda: body.precoVenda,
        observacao: body.observacao,
      },
    })

    if (result.isLeft()) {
      throw new NotFoundException(result.value.message)
    }

    const { produto, precoVenda } = result.value
    return { ...produto, precoVenda }
  }
}
