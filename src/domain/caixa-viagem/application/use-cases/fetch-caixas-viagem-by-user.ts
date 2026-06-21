import { Injectable } from '@nestjs/common'
import { type Either, right } from '../../../../core/either'
import { CaixaViagemRepository } from '../repositories/caixa-viagem-repository'

interface FetchCaixasViagemByUserUseCaseRequest {
  userId: string
}

type FetchCaixasViagemByUserUseCaseResponse = Either<
  null,
  { caixas: unknown[] }
>

@Injectable()
export class FetchCaixasViagemByUserUseCase {
  constructor(private caixaViagemRepository: CaixaViagemRepository) {}

  async execute({
    userId,
  }: FetchCaixasViagemByUserUseCaseRequest): Promise<FetchCaixasViagemByUserUseCaseResponse> {
    const caixas = await this.caixaViagemRepository.findByUserId(userId)
    return right({ caixas })
  }
}
