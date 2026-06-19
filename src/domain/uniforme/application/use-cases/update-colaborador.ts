import { Injectable } from '@nestjs/common'
import { type Either, right } from '../../../../core/either'
import {
  UniformeRepository,
  type UpdateColaboradorData,
} from '../repositories/uniforme-repository'

export interface UpdateColaboradorRequest {
  id: number
  epiCargoId?: number | null
  epiObservacoes?: string
}

type UpdateColaboradorResponse = Either<
  never,
  {
    colaborador:
      | { id: number; epiCargoId: number | null }
      | Record<never, never>
  }
>

@Injectable()
export class UpdateColaboradorUseCase {
  constructor(private repo: UniformeRepository) {}

  async execute(
    req: UpdateColaboradorRequest,
  ): Promise<UpdateColaboradorResponse> {
    const data: UpdateColaboradorData = {}
    if (req.epiCargoId !== undefined) data.epiCargoId = req.epiCargoId || null
    if (req.epiObservacoes !== undefined)
      data.epiObservacoes = req.epiObservacoes

    if (Object.keys(data).length === 0) {
      return right({ colaborador: {} })
    }

    const colaborador = await this.repo.updateColaborador(req.id, data)
    return right({ colaborador })
  }
}
