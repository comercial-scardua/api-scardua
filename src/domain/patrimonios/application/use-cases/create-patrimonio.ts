import { Injectable } from '@nestjs/common'
import { type Either, right } from '../../../../core/either'
import {
  type CreatePatrimonioData,
  PatrimoniosRepository,
} from '../repositories/patrimonios-repository'

type CreatePatrimonioUseCaseResponse = Either<null, { patrimonioId: number }>

@Injectable()
export class CreatePatrimonioUseCase {
  constructor(private patrimoniosRepository: PatrimoniosRepository) {}

  async execute(
    data: CreatePatrimonioData,
  ): Promise<CreatePatrimonioUseCaseResponse> {
    const patrimonio = await this.patrimoniosRepository.create(data)
    return right({ patrimonioId: patrimonio.id })
  }
}
