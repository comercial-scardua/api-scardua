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
import { AtualizarPrecosUseCase } from '../../../../domain/precificador/application/use-cases/atualizar-precos'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const atualizarPrecosBodySchema = z.object({
  itens: z
    .array(
      z.object({
        produtoId: z.number().int().positive(),
        preco: z.number().positive(),
      }),
    )
    .min(1),
})

type AtualizarPrecosBody = z.infer<typeof atualizarPrecosBodySchema>

@ApiTags('Precificador')
@ApiBearerAuth()
@Controller('/precificador')
@UseGuards(PermissionsGuard)
export class AtualizarPrecosController {
  constructor(private atualizarPrecos: AtualizarPrecosUseCase) {}

  @Post('atualizar-precos')
  @HttpCode(200)
  @RequirePermission('precificador', 'edit')
  @ApiOperation({
    summary: 'Atualizar preços de produtos (array de { produtoId, preco })',
  })
  @UsePipes(new ZodValidationPipe(atualizarPrecosBodySchema))
  async handle(@Body() body: AtualizarPrecosBody) {
    const result = await this.atualizarPrecos.execute(body)
    return result.value
  }
}
