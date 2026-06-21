import { Injectable } from '@nestjs/common'
import { type Either, right } from '../../../../core/either'
import { CaixaViagemRepository } from '../repositories/caixa-viagem-repository'

interface FetchAdiantamentosUseCaseRequest {
  caixaViagemId?: number
  colaboradorId?: number
}

type FetchAdiantamentosUseCaseResponse = Either<
  null,
  { adiantamentos: unknown[] }
>

@Injectable()
export class FetchAdiantamentosUseCase {
  constructor(private caixaViagemRepository: CaixaViagemRepository) {}

  async execute({
    caixaViagemId,
    colaboradorId,
  }: FetchAdiantamentosUseCaseRequest): Promise<FetchAdiantamentosUseCaseResponse> {
    const adiantamentos = await this.caixaViagemRepository.findAdiantamentos(
      caixaViagemId,
      colaboradorId,
    )
    return right({ adiantamentos })
  }
}
