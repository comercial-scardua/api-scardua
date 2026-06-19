import { Injectable } from '@nestjs/common'
import { type Either, right } from '../../../../core/either'
import {
  type PatrimonioCompleto,
  PatrimoniosRepository,
} from '../repositories/patrimonios-repository'

type FetchPatrimoniosUseCaseResponse = Either<
  null,
  { patrimonios: PatrimonioCompleto[] }
>

@Injectable()
export class FetchPatrimoniosUseCase {
  constructor(private patrimoniosRepository: PatrimoniosRepository) {}

  async execute(
    showHidden?: boolean,
  ): Promise<FetchPatrimoniosUseCaseResponse> {
    const patrimonios = await this.patrimoniosRepository.findAll(showHidden)
    return right({ patrimonios })
  }
}
