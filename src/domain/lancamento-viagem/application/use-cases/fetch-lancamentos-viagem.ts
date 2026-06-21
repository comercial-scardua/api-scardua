import { Injectable } from '@nestjs/common'
import { type Either, right } from '../../../../core/either'
import {
  type FindAllViagemFilters,
  type LancamentoViagemComCaixa,
  LancamentoViagemRepository,
} from '../repositories/lancamento-viagem-repository'

interface FetchLancamentosViagemUseCaseRequest {
  filters: FindAllViagemFilters
}

type FetchLancamentosViagemUseCaseResponse = Either<
  never,
  { lancamentos: LancamentoViagemComCaixa[] }
>

@Injectable()
export class FetchLancamentosViagemUseCase {
  constructor(private lancamentoViagemRepository: LancamentoViagemRepository) {}

  async execute({
    filters,
  }: FetchLancamentosViagemUseCaseRequest): Promise<FetchLancamentosViagemUseCaseResponse> {
    const lancamentos = await this.lancamentoViagemRepository.findAll(filters)
    return right({ lancamentos })
  }
}
