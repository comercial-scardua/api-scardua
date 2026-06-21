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
import { UpdateUltimoCaixaFuncionarioUseCase } from '../../../../domain/caixa-viagem/application/use-cases/update-ultimo-caixa-funcionario'
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
export class UpdateUltimoCaixaController {
  constructor(
    private updateUltimoCaixaFuncionario: UpdateUltimoCaixaFuncionarioUseCase,
  ) {}

  @Put('ultimo-caixa/:funcionarioId')
  @HttpCode(200)
  @RequirePermission('caixaviagem', 'edit')
  @ApiOperation({ summary: 'Atualizar último caixa do funcionário' })
  async handlePut(
    @Param('funcionarioId', ParseIntPipe) funcionarioId: number,
    @Body(new ZodValidationPipe(atualizarCaixaViagemBodySchema))
    body: AtualizarCaixaViagemBody,
  ) {
    const result = await this.updateUltimoCaixaFuncionario.execute({
      funcionarioId,
      data: body,
    })

    if (result.isLeft()) {
      throw new NotFoundException(result.value.message)
    }

    return result.value.caixa
  }

  @Patch('ultimo-caixa/:funcionarioId')
  @HttpCode(200)
  @RequirePermission('caixaviagem', 'edit')
  @ApiOperation({
    summary: 'Atualização parcial do último caixa do funcionário',
  })
  async handlePatch(
    @Param('funcionarioId', ParseIntPipe) funcionarioId: number,
    @Body(new ZodValidationPipe(atualizarCaixaViagemBodySchema))
    body: AtualizarCaixaViagemBody,
  ) {
    const result = await this.updateUltimoCaixaFuncionario.execute({
      funcionarioId,
      data: body,
    })

    if (result.isLeft()) {
      throw new NotFoundException(result.value.message)
    }

    return result.value.caixa
  }
}
