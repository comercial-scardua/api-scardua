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
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { ImportarPrecoVendaUseCase } from '../../../../domain/preco-venda/application/use-cases/importar-preco-venda'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const importarPrecoVendaBodySchema = z.object({
  itens: z
    .array(
      z.object({
        produtoId: z.number().int().positive(),
        precoVenda: z.number().positive(),
      }),
    )
    .min(1),
})

type ImportarPrecoVendaBody = z.infer<typeof importarPrecoVendaBodySchema>

@ApiTags('Preco de Venda')
@ApiBearerAuth()
@Controller('/preco-venda')
@UseGuards(PermissionsGuard)
export class ImportarPrecoVendaController {
  constructor(private importarPrecoVenda: ImportarPrecoVendaUseCase) {}

  @Post('importar')
  @HttpCode(201)
  @RequirePermission('preco-venda', 'edit')
  @ApiOperation({ summary: 'Importar múltiplos preços de venda (array)' })
  @UsePipes(new ZodValidationPipe(importarPrecoVendaBodySchema))
  async handle(@Body() body: ImportarPrecoVendaBody) {
    const result = await this.importarPrecoVenda.execute({
      itens: body.itens,
    })

    return result.value
  }
}
