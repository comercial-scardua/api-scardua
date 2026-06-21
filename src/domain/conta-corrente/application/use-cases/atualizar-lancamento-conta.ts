import { Injectable } from '@nestjs/common'
import type { lancamentos } from '@prisma/client'
import { type Either, right } from '../../../../core/either'
import {
  ContaCorrenteRepository,
  type CreateLancamentoData,
} from '../repositories/conta-corrente-repository'

interface AtualizarLancamentoContaUseCaseRequest {
  lancamentoId: number
  data: Partial<CreateLancamentoData>
}

type AtualizarLancamentoContaUseCaseResponse = Either<
  never,
  { lancamento: lancamentos }
>

@Injectable()
export class AtualizarLancamentoContaUseCase {
  constructor(private contaCorrenteRepository: ContaCorrenteRepository) {}

  async execute({
    lancamentoId,
    data,
  }: AtualizarLancamentoContaUseCaseRequest): Promise<AtualizarLancamentoContaUseCaseResponse> {
    const lancamento = await this.contaCorrenteRepository.atualizarLancamento(
      lancamentoId,
      data,
    )
    return right({ lancamento })
  }
}
