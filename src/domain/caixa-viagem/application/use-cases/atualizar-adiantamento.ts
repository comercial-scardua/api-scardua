import { Injectable } from '@nestjs/common'
import { type Either, left, right } from '../../../../core/either'
import {
  CaixaViagemRepository,
  type CriarAdiantamentoData,
} from '../repositories/caixa-viagem-repository'
import { AdiantamentoNaoEncontradoError } from './errors/adiantamento-nao-encontrado.error'

interface AtualizarAdiantamentoUseCaseRequest {
  id: number
  data: Partial<CriarAdiantamentoData>
}

type AtualizarAdiantamentoUseCaseResponse = Either<
  AdiantamentoNaoEncontradoError,
  { adiantamento: unknown }
>

@Injectable()
export class AtualizarAdiantamentoUseCase {
  constructor(private caixaViagemRepository: CaixaViagemRepository) {}

  async execute({
    id,
    data,
  }: AtualizarAdiantamentoUseCaseRequest): Promise<AtualizarAdiantamentoUseCaseResponse> {
    const existe = await this.caixaViagemRepository.findAdiantamentoById(id)
    if (!existe) return left(new AdiantamentoNaoEncontradoError(id))

    const adiantamento = await this.caixaViagemRepository.atualizarAdiantamento(
      id,
      data,
    )
    return right({ adiantamento })
  }
}
