import {
  BadRequestException,
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
import { CriarMovimentacaoEpiUseCase } from '../../../../domain/epi/application/use-cases/criar-movimentacao-epi'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const criarMovimentacaoBodySchema = z.object({
  colaborador_id: z.number().int().positive(),
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

type CriarMovimentacaoBody = z.infer<typeof criarMovimentacaoBodySchema>

@ApiTags('EPI')
@ApiBearerAuth()
@Controller('/epi')
@UseGuards(PermissionsGuard)
export class CreateMovimentacaoController {
  constructor(private criarMovimentacao: CriarMovimentacaoEpiUseCase) {}

  @Post('movimentacoes')
  @HttpCode(201)
  @RequirePermission('epi', 'edit')
  @ApiOperation({
    summary:
      'Registrar movimentação de EPI (entrega / devolução / troca / perda / baixa)',
  })
  @UsePipes(new ZodValidationPipe(criarMovimentacaoBodySchema))
  async handle(@Body() body: CriarMovimentacaoBody) {
    const result = await this.criarMovimentacao.execute(body)
    if (result.isLeft()) throw new BadRequestException(result.value.message)
    return result.value.movimentacao
  }
}
