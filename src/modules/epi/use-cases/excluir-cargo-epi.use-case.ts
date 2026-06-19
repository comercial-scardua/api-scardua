import { Injectable } from '@nestjs/common'
import { type Either, left, right } from '../../../core/either'
import { EpiRepository } from '../repositories/epi.repository'
import { CargoComEpisError } from './errors/cargo-com-epis.error'
import { CargoNaoEncontradoError } from './errors/cargo-nao-encontrado.error'

type Result = Either<CargoNaoEncontradoError | CargoComEpisError, void>

@Injectable()
export class ExcluirCargoEpiUseCase {
  constructor(private repo: EpiRepository) {}

  async execute(id: number): Promise<Result> {
    try {
      await this.repo.deleteCargo(id)
      return right(undefined)
    } catch (e: any) {
      if (e.message?.includes('EPIs obrigatórios'))
        return left(new CargoComEpisError(id))
      return left(new CargoNaoEncontradoError(id))
    }
  }
}
