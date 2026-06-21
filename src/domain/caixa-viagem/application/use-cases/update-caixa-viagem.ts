import { Injectable } from '@nestjs/common'
import { type Either, left, right } from '../../../../core/either'
import {
  type AtualizarCaixaViagemData,
  CaixaViagemRepository,
} from '../repositories/caixa-viagem-repository'
import { CaixaViagemNaoEncontradaError } from './errors/caixa-viagem-nao-encontrada.error'

interface UpdateCaixaViagemUseCaseRequest {
  id: number
  data: AtualizarCaixaViagemData
}

type UpdateCaixaViagemUseCaseResponse = Either<
  CaixaViagemNaoEncontradaError,
  { caixa: unknown }
>

@Injectable()
export class UpdateCaixaViagemUseCase {
  constructor(private caixaViagemRepository: CaixaViagemRepository) {}

  async execute({
    id,
    data,
  }: UpdateCaixaViagemUseCaseRequest): Promise<UpdateCaixaViagemUseCaseResponse> {
    const existe = await this.caixaViagemRepository.findById(id)
    if (!existe) return left(new CaixaViagemNaoEncontradaError(id))

    const caixa = await this.caixaViagemRepository.update(id, data)
    return right({ caixa })
  }
}
