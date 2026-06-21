import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { z } from 'zod'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { CriarMovimentacaoEpiUseCase } from '../../../../domain/epi/application/use-cases/criar-movimentacao-epi'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const criarMovimentacaoColabBodySchema = z.object({
  colaborador_id: z.number().int().positive().optional(),
  epi_id: z.number().int().positive(),
  tipo: z
    .enum(['entrega', 'devolucao', 'troca', 'perda', 'baixa'])
    .default('entrega'),
  quantidade: z.number().int().positive().default(1),
  data_movimentacao: z.string().min(1),
  responsavel: z.string().min(1),
  proxima_entrega: z.string().optional(),
  motivo: z.string().optional(),
  observacoes: z.string().optional(),
  empresaId: z.number().int().positive().optional(),
})

type CriarMovimentacaoColabBody = z.infer<
  typeof criarMovimentacaoColabBodySchema
>

@ApiTags('EPI')
@ApiBearerAuth()
@Controller('/epi')
@UseGuards(PermissionsGuard)
export class CreateMovimentacaoForColaboradorController {
  constructor(private criarMovimentacao: CriarMovimentacaoEpiUseCase) {}

  @Post('movimentacoes/colaborador/:id')
  @HttpCode(201)
  @RequirePermission('epi', 'edit')
  @ApiOperation({
    summary: 'Registrar movimentação para um colaborador específico',
  })
  async handle(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(criarMovimentacaoColabBodySchema))
    body: CriarMovimentacaoColabBody,
  ) {
    const result = await this.criarMovimentacao.execute({
      ...body,
      colaborador_id: id,
    })
    if (result.isLeft()) throw new BadRequestException(result.value.message)
    return result.value.movimentacao
  }
}
