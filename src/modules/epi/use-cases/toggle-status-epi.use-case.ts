import { Injectable } from '@nestjs/common'
import type { epis } from '@prisma/client'
import { type Either, left, right } from '../../../core/either'
import { EpiRepository } from '../repositories/epi.repository'
import { EpiNaoEncontradoError } from './errors/epi-nao-encontrado.error'

type Result = Either<EpiNaoEncontradoError, { epi: epis }>

@Injectable()
export class ToggleStatusEpiUseCase {
  constructor(private repo: EpiRepository) {}

  async execute(id: number): Promise<Result> {
    const existe = await this.repo.findEpiById(id)
    if (!existe) return left(new EpiNaoEncontradoError(id))

    const novoStatus =
      existe.status === 'ATIVO' ? ('INATIVO' as const) : ('ATIVO' as const)
    const epi = await this.repo.updateEpi(id, { status: novoStatus } as any)
    return right({ epi })
  }
}
