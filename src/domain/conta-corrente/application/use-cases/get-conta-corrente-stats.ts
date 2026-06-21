import { Injectable } from '@nestjs/common'
import { type Either, right } from '../../../../core/either'
import {
  ContaCorrenteRepository,
  type StatsContas,
} from '../repositories/conta-corrente-repository'

interface GetContaCorrenteStatsUseCaseRequest {
  userId: string
  showAll: boolean
}

type GetContaCorrenteStatsUseCaseResponse = Either<never, StatsContas>

@Injectable()
export class GetContaCorrenteStatsUseCase {
  constructor(private contaCorrenteRepository: ContaCorrenteRepository) {}

  async execute({
    userId,
    showAll,
  }: GetContaCorrenteStatsUseCaseRequest): Promise<GetContaCorrenteStatsUseCaseResponse> {
    const stats = await this.contaCorrenteRepository.stats(userId, showAll)
    return right(stats)
  }
}
