import { Injectable } from '@nestjs/common'
import { type Either, left, right } from '../../../../core/either'
import {
  CaixaViagemRepository,
  type CaixaViagemTermo,
} from '../repositories/caixa-viagem-repository'
import { CaixaViagemNaoEncontradaError } from './errors/caixa-viagem-nao-encontrada.error'

interface GenerateTermoCaixaViagemUseCaseRequest {
  caixaViagemId: number
}

type GenerateTermoCaixaViagemUseCaseResponse = Either<
  CaixaViagemNaoEncontradaError,
  { termo: CaixaViagemTermo }
>

@Injectable()
export class GenerateTermoCaixaViagemUseCase {
  constructor(private caixaViagemRepository: CaixaViagemRepository) {}

  async execute({
    caixaViagemId,
  }: GenerateTermoCaixaViagemUseCaseRequest): Promise<GenerateTermoCaixaViagemUseCaseResponse> {
    const termo = await this.caixaViagemRepository.gerarTermo(caixaViagemId)
    if (!termo) return left(new CaixaViagemNaoEncontradaError(caixaViagemId))

    return right({ termo })
  }
}
