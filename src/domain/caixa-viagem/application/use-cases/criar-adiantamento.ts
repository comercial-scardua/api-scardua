import { Injectable } from '@nestjs/common'
import { type Either, right } from '../../../../core/either'
import {
  CaixaViagemRepository,
  type CriarAdiantamentoData,
} from '../repositories/caixa-viagem-repository'

interface CriarAdiantamentoUseCaseRequest {
  data: CriarAdiantamentoData
}

type CriarAdiantamentoUseCaseResponse = Either<null, { adiantamento: unknown }>

@Injectable()
export class CriarAdiantamentoUseCase {
  constructor(private caixaViagemRepository: CaixaViagemRepository) {}

  async execute({
    data,
  }: CriarAdiantamentoUseCaseRequest): Promise<CriarAdiantamentoUseCaseResponse> {
    const adiantamento =
      await this.caixaViagemRepository.criarAdiantamento(data)
    return right({ adiantamento })
  }
}
