import { Injectable } from '@nestjs/common'
import { type Either, right } from '../../../../core/either'
import {
  type CargoUniformeRow,
  UniformeRepository,
} from '../repositories/uniforme-repository'

type ListCargoUniformeResponse = Either<never, { vinculos: CargoUniformeRow[] }>

@Injectable()
export class ListCargoUniformeUseCase {
  constructor(private repo: UniformeRepository) {}

  async execute(): Promise<ListCargoUniformeResponse> {
    const vinculos = await this.repo.listCargoUniforme()
    return right({ vinculos })
  }
}
