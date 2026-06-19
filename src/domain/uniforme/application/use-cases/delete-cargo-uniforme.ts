import { Injectable } from '@nestjs/common'
import { type Either, right } from '../../../../core/either'
import { UniformeRepository } from '../repositories/uniforme-repository'

type DeleteCargoUniformeResponse = Either<never, null>

@Injectable()
export class DeleteCargoUniformeUseCase {
  constructor(private repo: UniformeRepository) {}

  async execute(id: number): Promise<DeleteCargoUniformeResponse> {
    await this.repo.deleteCargoUniforme(id)
    return right(null)
  }
}
