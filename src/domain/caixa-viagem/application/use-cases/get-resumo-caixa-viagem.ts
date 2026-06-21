import { Injectable } from '@nestjs/common'
import { type Either, left, right } from '../../../../core/either'
import {
  CaixaViagemRepository,
  type CaixaViagemResumo,
} from '../repositories/caixa-viagem-repository'
import { CaixaViagemNaoEncontradaError } from './errors/caixa-viagem-nao-encontrada.error'

interface GetResumoCaixaViagemUseCaseRequest {
  id: number
}

type GetResumoCaixaViagemUseCaseResponse = Either<
  CaixaViagemNaoEncontradaError,
  { resumo: CaixaViagemResumo }
>

@Injectable()
export class GetResumoCaixaViagemUseCase {
  constructor(private caixaViagemRepository: CaixaViagemRepository) {}

  async execute({
    id,
  }: GetResumoCaixaViagemUseCaseRequest): Promise<GetResumoCaixaViagemUseCaseResponse> {
    const resumo = await this.caixaViagemRepository.resumo(id)
    if (!resumo) return left(new CaixaViagemNaoEncontradaError(id))

    return right({ resumo })
  }
}
