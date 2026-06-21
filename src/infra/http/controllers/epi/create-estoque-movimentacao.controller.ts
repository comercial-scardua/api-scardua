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
import { CriarEstoqueMovimentacaoUseCase } from '../../../../domain/epi/application/use-cases/criar-estoque-movimentacao'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const criarEstoqueMovimentacaoBodySchema = z.object({
  epi_id: z.number().int().positive(),
  tipo: z.enum(['entrada', 'saida', 'ajuste', 'perda', 'devolucao']),
  quantidade: z.number().int(),
  data_movimentacao: z.string().optional(),
  responsavel: z.string().min(1),
  observacoes: z.string().optional(),
  empresaId: z.number().int().positive().optional(),
})

type CriarEstoqueMovimentacaoBody = z.infer<
  typeof criarEstoqueMovimentacaoBodySchema
>

@ApiTags('EPI')
@ApiBearerAuth()
@Controller('/epi')
@UseGuards(PermissionsGuard)
export class CreateEstoqueMovimentacaoController {
  constructor(
    private criarEstoqueMovimentacao: CriarEstoqueMovimentacaoUseCase,
  ) {}

  @Post('estoque')
  @HttpCode(201)
  @RequirePermission('epi', 'edit')
  @ApiOperation({
    summary:
      'Registrar movimentação de estoque (entrada / saída / ajuste / perda / devolução)',
  })
  @UsePipes(new ZodValidationPipe(criarEstoqueMovimentacaoBodySchema))
  async handle(@Body() body: CriarEstoqueMovimentacaoBody) {
    const result = await this.criarEstoqueMovimentacao.execute(body)
    if (result.isLeft()) throw new BadRequestException(result.value.message)
    return result.value.movimentacao
  }
}
