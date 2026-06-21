import { Injectable } from '@nestjs/common'
import { type Either, right } from '../../../../core/either'
import {
  CaixaViagemRepository,
  type CaixaViagemStats,
} from '../repositories/caixa-viagem-repository'

type GetCaixaViagemStatsUseCaseResponse = Either<null, CaixaViagemStats>

@Injectable()
export class GetCaixaViagemStatsUseCase {
  constructor(private caixaViagemRepository: CaixaViagemRepository) {}

  async execute(): Promise<GetCaixaViagemStatsUseCaseResponse> {
    const stats = await this.caixaViagemRepository.stats()
    return right(stats)
  }
}
