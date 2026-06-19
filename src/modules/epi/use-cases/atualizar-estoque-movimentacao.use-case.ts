import { Injectable } from '@nestjs/common'
import type { epi_estoque_movimentacoes } from '@prisma/client'
import { type Either, left, right } from '../../../core/either'
import type { CriarMovimentacaoEstoqueDto } from '../dto/criar-movimentacao-estoque.dto'
import { EpiRepository } from '../repositories/epi.repository'
import { EstoqueInsuficienteError } from './errors/estoque-insuficiente.error'
import { MovimentacaoNaoEncontradaError } from './errors/movimentacao-nao-encontrada.error'

type Result = Either<
  MovimentacaoNaoEncontradaError | EstoqueInsuficienteError,
  { movimentacao: epi_estoque_movimentacoes }
>

@Injectable()
export class AtualizarEstoqueMovimentacaoUseCase {
  constructor(private repo: EpiRepository) {}

  async execute(
    id: number,
    dto: Partial<CriarMovimentacaoEstoqueDto>,
  ): Promise<Result> {
    try {
      const movimentacao = await this.repo.updateEstoqueMovimentacao(id, dto)
      return right({ movimentacao })
    } catch (e: any) {
      if (e.message?.includes('insuficiente')) {
        return left(new EstoqueInsuficienteError(0, dto.quantidade ?? 0))
      }
      return left(new MovimentacaoNaoEncontradaError(id))
    }
  }
}
