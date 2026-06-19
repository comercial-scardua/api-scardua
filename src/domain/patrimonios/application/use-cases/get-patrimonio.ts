import { Injectable } from '@nestjs/common'
import { type Either, left, right } from '../../../../core/either'
import {
  type PatrimonioCompleto,
  PatrimoniosRepository,
} from '../repositories/patrimonios-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface GetPatrimonioUseCaseRequest {
  patrimonioId: number
}

type GetPatrimonioUseCaseResponse = Either<
  ResourceNotFoundError,
  { patrimonio: PatrimonioCompleto }
>

@Injectable()
export class GetPatrimonioUseCase {
  constructor(private patrimoniosRepository: PatrimoniosRepository) {}

  async execute({
    patrimonioId,
  }: GetPatrimonioUseCaseRequest): Promise<GetPatrimonioUseCaseResponse> {
    const patrimonio = await this.patrimoniosRepository.findById(patrimonioId)

    if (!patrimonio) {
      return left(new ResourceNotFoundError(patrimonioId))
    }

    return right({ patrimonio })
  }
}
