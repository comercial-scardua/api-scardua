import { Injectable } from '@nestjs/common'
import { type Either, left, right } from '../../../../core/either'
import { LancamentoRepository } from '../repositories/lancamento-repository'
import { ContaCorrenteNaoEncontradaError } from './errors/conta-corrente-nao-encontrada.error'
import { LancamentoNaoEncontradoError } from './errors/lancamento-nao-encontrado.error'

interface RemoveLancamentoForUserUseCaseRequest {
  colaboradorId: number
  lancamentoId: number
}

type RemoveLancamentoForUserUseCaseResponse = Either<
  ContaCorrenteNaoEncontradaError | LancamentoNaoEncontradoError,
  null
>

@Injectable()
export class RemoveLancamentoForUserUseCase {
  constructor(private lancamentoRepository: LancamentoRepository) {}

  async execute({
    colaboradorId,
    lancamentoId,
  }: RemoveLancamentoForUserUseCaseRequest): Promise<RemoveLancamentoForUserUseCaseResponse> {
    const conta =
      await this.lancamentoRepository.findContaByColaboradorId(colaboradorId)

    if (!conta) {
      return left(new ContaCorrenteNaoEncontradaError(colaboradorId))
    }

    const lancamento =
      await this.lancamentoRepository.findLancamentoByIdAndConta(
        lancamentoId,
        conta.id,
      )

    if (!lancamento) {
      return left(new LancamentoNaoEncontradoError(lancamentoId))
    }

    await this.lancamentoRepository.removeLancamento(lancamentoId)
    return right(null)
  }
}
