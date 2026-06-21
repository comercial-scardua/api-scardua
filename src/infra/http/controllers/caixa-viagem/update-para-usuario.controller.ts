import {
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Put,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { z } from 'zod'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { UpdateCaixaViagemUseCase } from '../../../../domain/caixa-viagem/application/use-cases/update-caixa-viagem'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const atualizarCaixaViagemBodySchema = z.object({
  destino: z.string().optional(),
  data: z.string().optional(),
  empresaId: z.number().optional().nullable(),
  funcionarioId: z.number().optional().nullable(),
  veiculoId: z.number().optional().nullable(),
  numeroCaixa: z.number().optional(),
  observacao: z.string().optional().nullable(),
  saldoAnterior: z.number().optional(),
  oculto: z.boolean().optional(),
  userId: z.string().optional().nullable(),
})

type AtualizarCaixaViagemBody = z.infer<typeof atualizarCaixaViagemBodySchema>

@ApiTags('Caixa Viagem')
@ApiBearerAuth()
@Controller('/caixaviagem')
@UseGuards(PermissionsGuard)
export class UpdateParaUsuarioController {
  constructor(private updateCaixaViagem: UpdateCaixaViagemUseCase) {}

  @Put('usuario/:id')
  @HttpCode(200)
  @RequirePermission('caixaviagem', 'edit')
  @ApiOperation({ summary: 'Atualizar caixa de viagem por ID (rota usuario)' })
  async handlePut(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(atualizarCaixaViagemBodySchema))
    body: AtualizarCaixaViagemBody,
  ) {
    const result = await this.updateCaixaViagem.execute({ id, data: body })

    if (result.isLeft()) {
      throw new NotFoundException(result.value.message)
    }

    return result.value.caixa
  }

  @Patch('usuario/:id')
  @HttpCode(200)
  @RequirePermission('caixaviagem', 'edit')
  @ApiOperation({
    summary: 'Atualização parcial de caixa de viagem (rota usuario)',
  })
  async handlePatch(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(atualizarCaixaViagemBodySchema))
    body: AtualizarCaixaViagemBody,
  ) {
    const result = await this.updateCaixaViagem.execute({ id, data: body })

    if (result.isLeft()) {
      throw new NotFoundException(result.value.message)
    }

    return result.value.caixa
  }
}
