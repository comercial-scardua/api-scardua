import {
  Body,
  Controller,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { z } from 'zod'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { AtualizarLancamentoContaUseCase } from '../../../../domain/conta-corrente/application/use-cases/atualizar-lancamento-conta'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const atualizarLancamentoBodySchema = z.object({
  data: z.string().optional(),
  numeroDocumento: z.string().optional(),
  observacao: z.string().optional(),
  credito: z.string().optional(),
  debito: z.string().optional(),
})

type AtualizarLancamentoBody = z.infer<typeof atualizarLancamentoBodySchema>

@ApiTags('Conta Corrente')
@ApiBearerAuth()
@Controller('/conta-corrente')
@UseGuards(PermissionsGuard)
export class AtualizarLancamentoController {
  constructor(private atualizarLancamento: AtualizarLancamentoContaUseCase) {}

  @Patch(':id/lancamentos/:lancamentoId')
  @HttpCode(200)
  @RequirePermission('contacorrente', 'access')
  @ApiOperation({ summary: 'Atualizar lançamento' })
  async handle(
    @Param('id', ParseIntPipe) _id: number,
    @Param('lancamentoId', ParseIntPipe) lancamentoId: number,
    @Body(new ZodValidationPipe(atualizarLancamentoBodySchema))
    body: AtualizarLancamentoBody,
  ) {
    const result = await this.atualizarLancamento.execute({
      lancamentoId,
      data: body,
    })
    return result.value.lancamento
  }
}
