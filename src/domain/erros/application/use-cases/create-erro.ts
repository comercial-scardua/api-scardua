import { Injectable } from '@nestjs/common'
import type { erros_solucoes } from '@prisma/client'
import { type Either, right } from '../../../../core/either'
import {
  type CreateErroData,
  ErrosRepository,
} from '../repositories/erros-repository'

type CreateErroUseCaseResponse = Either<null, { erro: erros_solucoes }>

@Injectable()
export class CreateErroUseCase {
  constructor(private errosRepository: ErrosRepository) {}

  async execute(data: CreateErroData): Promise<CreateErroUseCaseResponse> {
    const erro = await this.errosRepository.create(data)
    return right({ erro })
  }
}
