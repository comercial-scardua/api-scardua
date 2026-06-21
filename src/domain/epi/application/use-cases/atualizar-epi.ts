import { Injectable } from '@nestjs/common'
import type { epis } from '@prisma/client'
import { type Either, left, right } from '../../../../core/either'
import type { AtualizarEpiData } from '../repositories/epi-repository'
import { EpiRepository } from '../repositories/epi-repository'
import { EpiNaoEncontradoError } from './errors/epi-nao-encontrado.error'

type Result = Either<EpiNaoEncontradoError, { epi: epis }>

@Injectable()
export class AtualizarEpiUseCase {
  constructor(private repo: EpiRepository) {}

  async execute(id: number, dto: AtualizarEpiData): Promise<Result> {
    const existe = await this.repo.findEpiById(id)
    if (!existe) return left(new EpiNaoEncontradoError(id))

    const epi = await this.repo.updateEpi(id, dto)
    return right({ epi })
  }
}
