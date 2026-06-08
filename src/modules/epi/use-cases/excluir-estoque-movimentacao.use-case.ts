import { Injectable } from '@nestjs/common'
import { type Either, left, right } from '../../../core/either'
import { EpiRepository } from '../repositories/epi.repository'
import { MovimentacaoNaoEncontradaError } from './errors/movimentacao-nao-encontrada.error'

type Result = Either<MovimentacaoNaoEncontradaError, void>

@Injectable()
export class ExcluirEstoqueMovimentacaoUseCase {
  constructor(private repo: EpiRepository) {}

  async execute(id: number): Promise<Result> {
    try {
      await this.repo.deleteEstoqueMovimentacao(id)
      return right(undefined)
    } catch {
      return left(new MovimentacaoNaoEncontradaError(id))
    }
  }
}
