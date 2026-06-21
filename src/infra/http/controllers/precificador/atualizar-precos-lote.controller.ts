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
import { AtualizarPrecosLoteUseCase } from '../../../../domain/precificador/application/use-cases/atualizar-precos-lote'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const atualizarPrecosLoteBodySchema = z.object({
  itens: z
    .array(
      z.object({
        produtoId: z.number().int().positive(),
        preco: z.number().positive(),
      }),
    )
    .min(1),
})

type AtualizarPrecosLoteBody = z.infer<typeof atualizarPrecosLoteBodySchema>

@ApiTags('Precificador')
@ApiBearerAuth()
@Controller('/precificador')
@UseGuards(PermissionsGuard)
export class AtualizarPrecosLoteController {
  constructor(private atualizarPrecosLote: AtualizarPrecosLoteUseCase) {}

  @Post('atualizar-precos-lote')
  @HttpCode(200)
  @RequirePermission('precificador', 'edit')
  @ApiOperation({
    summary:
      'Atualizar preços em lote maior (mesma lógica, sem limite de itens)',
  })
  @UsePipes(new ZodValidationPipe(atualizarPrecosLoteBodySchema))
  async handle(@Body() body: AtualizarPrecosLoteBody) {
    const result = await this.atualizarPrecosLote.execute(body)
    return result.value
  }
}
