import { Injectable } from '@nestjs/common'
import { type Either, left, right } from '../../../core/either'
import { EpiRepository } from '../repositories/epi.repository'
import { EpiComVinculosError } from './errors/epi-com-vinculos.error'
import { EpiNaoEncontradoError } from './errors/epi-nao-encontrado.error'

type Result = Either<EpiNaoEncontradoError | EpiComVinculosError, void>

@Injectable()
export class ExcluirEpiUseCase {
  constructor(private repo: EpiRepository) {}

  async execute(id: number): Promise<Result> {
    try {
      await this.repo.deleteEpi(id)
      return right(undefined)
    } catch (e: any) {
      if (e.message?.includes('vínculos'))
        return left(new EpiComVinculosError(id))
      return left(new EpiNaoEncontradoError(id))
    }
  }
}
