import {
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  ParseIntPipe,
  Put,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { z } from 'zod'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { AtualizarAdiantamentoUseCase } from '../../../../domain/caixa-viagem/application/use-cases/atualizar-adiantamento'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const atualizarAdiantamentoBodySchema = z.object({
  data: z.string().optional(),
  saida: z.string().optional(),
  observacao: z.string().optional().nullable(),
  nome: z.string().min(1).optional(),
  caixaViagemId: z.number().optional().nullable(),
  colaboradorId: z.number().optional().nullable(),
  userId: z.string().optional().nullable(),
  oculto: z.boolean().optional(),
})

type AtualizarAdiantamentoBody = z.infer<typeof atualizarAdiantamentoBodySchema>

@ApiTags('Caixa Viagem')
@ApiBearerAuth()
@Controller('/caixaviagem')
@UseGuards(PermissionsGuard)
export class AtualizarAdiantamentoController {
  constructor(private atualizarAdiantamento: AtualizarAdiantamentoUseCase) {}

  @Put('adiantamento/:id')
  @HttpCode(200)
  @RequirePermission('caixaviagem', 'edit')
  @ApiOperation({ summary: 'Atualizar adiantamento' })
  async handle(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(atualizarAdiantamentoBodySchema))
    body: AtualizarAdiantamentoBody,
  ) {
    const result = await this.atualizarAdiantamento.execute({
      id,
      data: body,
    })

    if (result.isLeft()) {
      throw new NotFoundException(result.value.message)
    }

    return result.value.adiantamento
  }
}
