import { Injectable } from '@nestjs/common'
import { type Either, right } from '../../../../core/either'
import { ContaCorrenteRepository } from '../repositories/conta-corrente-repository'

interface ExcluirLancamentoContaUseCaseRequest {
  lancamentoId: number
}

type ExcluirLancamentoContaUseCaseResponse = Either<never, null>

@Injectable()
export class ExcluirLancamentoContaUseCase {
  constructor(private contaCorrenteRepository: ContaCorrenteRepository) {}

  async execute({
    lancamentoId,
  }: ExcluirLancamentoContaUseCaseRequest): Promise<ExcluirLancamentoContaUseCaseResponse> {
    await this.contaCorrenteRepository.excluirLancamento(lancamentoId)
    return right(null)
  }
}
