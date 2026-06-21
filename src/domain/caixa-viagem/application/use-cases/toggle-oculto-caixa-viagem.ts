import { Injectable } from '@nestjs/common'
import { type Either, left, right } from '../../../../core/either'
import { CaixaViagemRepository } from '../repositories/caixa-viagem-repository'
import { CaixaViagemNaoEncontradaError } from './errors/caixa-viagem-nao-encontrada.error'

interface ToggleOcultoCaixaViagemUseCaseRequest {
  id: number
}

type ToggleOcultoCaixaViagemUseCaseResponse = Either<
  CaixaViagemNaoEncontradaError,
  { caixa: unknown }
>

@Injectable()
export class ToggleOcultoCaixaViagemUseCase {
  constructor(private caixaViagemRepository: CaixaViagemRepository) {}

  async execute({
    id,
  }: ToggleOcultoCaixaViagemUseCaseRequest): Promise<ToggleOcultoCaixaViagemUseCaseResponse> {
    const existe = await this.caixaViagemRepository.findById(id)
    if (!existe) return left(new CaixaViagemNaoEncontradaError(id))

    const caixa = await this.caixaViagemRepository.toggleOculto(id)
    return right({ caixa })
  }
}
