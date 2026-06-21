import { Injectable } from '@nestjs/common'
import type { JwtPayload } from '../../../../auth/types/jwt-payload.type'
import { type Either, right } from '../../../../core/either'
import type { ColaboradorEpi } from '../repositories/epi-repository'
import { EpiRepository } from '../repositories/epi-repository'

type Result = Either<never, { colaboradores: ColaboradorEpi[] }>

@Injectable()
export class ListarColaboradoresEpiUseCase {
  constructor(private repo: EpiRepository) {}

  async execute(
    user: JwtPayload,
    filters: { empresaId?: number; status?: string },
  ): Promise<Result> {
    let gestorColaboradorId: number | undefined

    if (user.role !== 'ADMIN') {
      const id = await this.repo.findColaboradorIdByUserId(user.userId)
      if (id) gestorColaboradorId = id
    }

    const colaboradores = await this.repo.findColaboradores(
      filters,
      gestorColaboradorId,
    )
    return right({ colaboradores })
  }
}
