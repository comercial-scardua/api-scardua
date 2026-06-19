import { Injectable } from '@nestjs/common'
import { type Either, right } from '../../../../core/either'
import {
  type ResponsavelRow,
  UniformeRepository,
} from '../repositories/uniforme-repository'

type ListResponsaveisResponse = Either<
  never,
  { responsaveis: ResponsavelRow[] }
>

@Injectable()
export class ListResponsaveisUseCase {
  constructor(private repo: UniformeRepository) {}

  async execute(): Promise<ListResponsaveisResponse> {
    const responsaveis = await this.repo.listResponsaveis()
    return right({ responsaveis })
  }
}
