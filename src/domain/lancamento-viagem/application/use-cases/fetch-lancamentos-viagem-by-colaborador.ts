import { Injectable } from '@nestjs/common'
import { type Either, right } from '../../../../core/either'
import {
  type LancamentoViagemComCaixa,
  LancamentoViagemRepository,
} from '../repositories/lancamento-viagem-repository'

interface FetchLancamentosViagemByColaboradorUseCaseRequest {
  colaboradorId: number
}

type FetchLancamentosViagemByColaboradorUseCaseResponse = Either<
  never,
  { lancamentos: LancamentoViagemComCaixa[] }
>

@Injectable()
export class FetchLancamentosViagemByColaboradorUseCase {
  constructor(private lancamentoViagemRepository: LancamentoViagemRepository) {}

  async execute({
    colaboradorId,
  }: FetchLancamentosViagemByColaboradorUseCaseRequest): Promise<FetchLancamentosViagemByColaboradorUseCaseResponse> {
    const lancamentos =
      await this.lancamentoViagemRepository.findByColaboradorId(colaboradorId)
    return right({ lancamentos })
  }
}
