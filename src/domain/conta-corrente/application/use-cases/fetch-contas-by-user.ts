import { Injectable } from '@nestjs/common'
import { type Either, right } from '../../../../core/either'
import {
  type ContaComLancamentos,
  ContaCorrenteRepository,
} from '../repositories/conta-corrente-repository'

interface FetchContasByUserUseCaseRequest {
  userId: string
}

type FetchContasByUserUseCaseResponse = Either<
  never,
  { contas: ContaComLancamentos[] }
>

@Injectable()
export class FetchContasByUserUseCase {
  constructor(private contaCorrenteRepository: ContaCorrenteRepository) {}

  async execute({
    userId,
  }: FetchContasByUserUseCaseRequest): Promise<FetchContasByUserUseCaseResponse> {
    const contas = await this.contaCorrenteRepository.findByUserId(userId)
    return right({ contas })
  }
}
