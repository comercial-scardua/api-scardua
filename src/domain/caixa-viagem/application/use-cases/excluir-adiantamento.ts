import { Injectable } from '@nestjs/common'
import { type Either, left, right } from '../../../../core/either'
import { CaixaViagemRepository } from '../repositories/caixa-viagem-repository'
import { AdiantamentoNaoEncontradoError } from './errors/adiantamento-nao-encontrado.error'

interface ExcluirAdiantamentoUseCaseRequest {
  id: number
}

type ExcluirAdiantamentoUseCaseResponse = Either<
  AdiantamentoNaoEncontradoError,
  null
>

@Injectable()
export class ExcluirAdiantamentoUseCase {
  constructor(private caixaViagemRepository: CaixaViagemRepository) {}

  async execute({
    id,
  }: ExcluirAdiantamentoUseCaseRequest): Promise<ExcluirAdiantamentoUseCaseResponse> {
    const existe = await this.caixaViagemRepository.findAdiantamentoById(id)
    if (!existe) return left(new AdiantamentoNaoEncontradoError(id))

    await this.caixaViagemRepository.excluirAdiantamento(id)
    return right(null)
  }
}
