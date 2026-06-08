import { Injectable } from '@nestjs/common'
import { type Either, left, right } from '../../../core/either'
import type { AdicionarEpiCargoDto } from '../dto/adicionar-epi-cargo.dto'
import type { CargoEpiLink } from '../repositories/epi.repository'
import { EpiRepository } from '../repositories/epi.repository'
import { VinculoJaExisteError } from './errors/vinculo-ja-existe.error'

type Result = Either<VinculoJaExisteError, { link: CargoEpiLink }>

@Injectable()
export class CriarCargoEpiLinkUseCase {
  constructor(private repo: EpiRepository) {}

  async execute(dto: AdicionarEpiCargoDto & { cargo_id: number }): Promise<Result> {
    try {
      const link = await this.repo.createCargoEpiLink(dto)
      return right({ link })
    } catch (e: any) {
      if (e.message?.includes('já existe')) return left(new VinculoJaExisteError())
      throw e
    }
  }
}
