import {
  BadRequestException,
  Body,
  Controller,
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
import { AtualizarEstoqueMovimentacaoUseCase } from '../../../../domain/epi/application/use-cases/atualizar-estoque-movimentacao'
import { EstoqueInsuficienteError } from '../../../../domain/epi/application/use-cases/errors/estoque-insuficiente.error'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const atualizarEstoqueBodySchema = z.object({
  epi_id: z.number().int().positive().optional(),
  tipo: z.enum(['entrada', 'saida', 'ajuste', 'perda', 'devolucao']).optional(),
  quantidade: z.number().int().optional(),
  data_movimentacao: z.string().optional(),
  responsavel: z.string().min(1).optional(),
  observacoes: z.string().optional(),
  empresaId: z.number().int().positive().optional(),
})

type AtualizarEstoqueBody = z.infer<typeof atualizarEstoqueBodySchema>

@ApiTags('EPI')
@ApiBearerAuth()
@Controller('/epi')
@UseGuards(PermissionsGuard)
export class UpdateEstoqueMovimentacaoController {
  constructor(
    private atualizarEstoqueMovimentacao: AtualizarEstoqueMovimentacaoUseCase,
  ) {}

  @Put('estoque/:id')
  @RequirePermission('epi', 'edit')
  @ApiOperation({ summary: 'Atualizar movimentação de estoque' })
  async handle(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(atualizarEstoqueBodySchema))
    body: AtualizarEstoqueBody,
  ) {
    const result = await this.atualizarEstoqueMovimentacao.execute(id, body)
    if (result.isLeft()) {
      if (result.value instanceof EstoqueInsuficienteError)
        throw new BadRequestException(result.value.message)
      throw new NotFoundException(result.value.message)
    }
    return result.value.movimentacao
  }
}
