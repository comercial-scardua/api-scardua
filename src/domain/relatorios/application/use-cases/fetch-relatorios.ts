import { Injectable } from '@nestjs/common'
import type { relatorios } from '@prisma/client'
import { type Either, right } from '../../../../core/either'
import {
  type FindAllRelatoriosFilters,
  RelatoriosRepository,
} from '../repositories/relatorios-repository'

type FetchRelatoriosUseCaseResponse = Either<null, { relatorios: relatorios[] }>

@Injectable()
export class FetchRelatoriosUseCase {
  constructor(private relatoriosRepository: RelatoriosRepository) {}

  async execute(
    filters: FindAllRelatoriosFilters,
  ): Promise<FetchRelatoriosUseCaseResponse> {
    const relatorios = await this.relatoriosRepository.findAll(filters)
    return right({ relatorios })
  }
}
