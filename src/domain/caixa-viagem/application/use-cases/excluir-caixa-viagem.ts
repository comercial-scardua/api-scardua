import { Injectable } from '@nestjs/common'
import { type Either, left, right } from '../../../../core/either'
import { CaixaViagemRepository } from '../repositories/caixa-viagem-repository'
import { CaixaViagemNaoEncontradaError } from './errors/caixa-viagem-nao-encontrada.error'

interface ExcluirCaixaViagemUseCaseRequest {
  id: number
}

type ExcluirCaixaViagemUseCaseResponse = Either<
  CaixaViagemNaoEncontradaError,
  null
>

@Injectable()
export class ExcluirCaixaViagemUseCase {
  constructor(private caixaViagemRepository: CaixaViagemRepository) {}

  async execute({
    id,
  }: ExcluirCaixaViagemUseCaseRequest): Promise<ExcluirCaixaViagemUseCaseResponse> {
    const existe = await this.caixaViagemRepository.findById(id)
    if (!existe) return left(new CaixaViagemNaoEncontradaError(id))

    await this.caixaViagemRepository.excluir(id)
    return right(null)
  }
}
