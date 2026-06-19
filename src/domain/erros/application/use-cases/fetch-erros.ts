import { Injectable } from '@nestjs/common'
import type { erros_solucoes } from '@prisma/client'
import { type Either, right } from '../../../../core/either'
import {
  ErrosRepository,
  type FindAllErrosFilters,
} from '../repositories/erros-repository'

type FetchErrosUseCaseResponse = Either<null, { erros: erros_solucoes[] }>

@Injectable()
export class FetchErrosUseCase {
  constructor(private errosRepository: ErrosRepository) {}

  async execute(
    filters: FindAllErrosFilters,
  ): Promise<FetchErrosUseCaseResponse> {
    const erros = await this.errosRepository.findAll(filters)
    return right({ erros })
  }
}
