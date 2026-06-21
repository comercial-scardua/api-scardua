import { Injectable } from '@nestjs/common'
import type { conta_corrente } from '@prisma/client'
import { type Either, right } from '../../../../core/either'
import {
  ContaCorrenteRepository,
  type CreateContaCorrenteData,
} from '../repositories/conta-corrente-repository'

interface CreateContaCorrenteUseCaseRequest {
  data: CreateContaCorrenteData
  userId: string
}

type CreateContaCorrenteUseCaseResponse = Either<
  never,
  { conta: conta_corrente }
>

@Injectable()
export class CreateContaCorrenteUseCase {
  constructor(private contaCorrenteRepository: ContaCorrenteRepository) {}

  async execute({
    data,
    userId,
  }: CreateContaCorrenteUseCaseRequest): Promise<CreateContaCorrenteUseCaseResponse> {
    const conta = await this.contaCorrenteRepository.create(data, userId)
    return right({ conta })
  }
}
