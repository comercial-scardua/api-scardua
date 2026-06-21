import { Injectable } from '@nestjs/common'
import { type Either, right } from '../../../../core/either'
import {
  CaixaViagemRepository,
  type CriarCaixaViagemData,
} from '../repositories/caixa-viagem-repository'

interface CreateCaixaViagemUseCaseRequest {
  data: CriarCaixaViagemData
  userId: string
}

type CreateCaixaViagemUseCaseResponse = Either<null, { caixa: unknown }>

@Injectable()
export class CreateCaixaViagemUseCase {
  constructor(private caixaViagemRepository: CaixaViagemRepository) {}

  async execute({
    data,
    userId,
  }: CreateCaixaViagemUseCaseRequest): Promise<CreateCaixaViagemUseCaseResponse> {
    const caixa = await this.caixaViagemRepository.create(data, userId)
    return right({ caixa })
  }
}
