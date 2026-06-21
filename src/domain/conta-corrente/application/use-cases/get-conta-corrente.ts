import { Injectable } from '@nestjs/common'
import { type Either, left, right } from '../../../../core/either'
import {
  type ContaComLancamentos,
  ContaCorrenteRepository,
} from '../repositories/conta-corrente-repository'
import { ContaNaoEncontradaError } from './errors/conta-nao-encontrada.error'

interface GetContaCorrenteUseCaseRequest {
  id: number
}

type GetContaCorrenteUseCaseResponse = Either<
  ContaNaoEncontradaError,
  { conta: ContaComLancamentos }
>

@Injectable()
export class GetContaCorrenteUseCase {
  constructor(private contaCorrenteRepository: ContaCorrenteRepository) {}

  async execute({
    id,
  }: GetContaCorrenteUseCaseRequest): Promise<GetContaCorrenteUseCaseResponse> {
    const conta = await this.contaCorrenteRepository.findById(id)
    if (!conta) return left(new ContaNaoEncontradaError(id))
    return right({ conta })
  }
}
