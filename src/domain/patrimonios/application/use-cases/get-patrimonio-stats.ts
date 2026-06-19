import { Injectable } from '@nestjs/common'
import { type Either, right } from '../../../../core/either'
import {
  type PatrimonioStats,
  PatrimoniosRepository,
} from '../repositories/patrimonios-repository'

type GetPatrimonioStatsUseCaseResponse = Either<null, PatrimonioStats>

@Injectable()
export class GetPatrimonioStatsUseCase {
  constructor(private patrimoniosRepository: PatrimoniosRepository) {}

  async execute(): Promise<GetPatrimonioStatsUseCaseResponse> {
    const stats = await this.patrimoniosRepository.stats()
    return right(stats)
  }
}
