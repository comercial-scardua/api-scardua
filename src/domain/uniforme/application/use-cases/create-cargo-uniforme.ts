import { Injectable } from '@nestjs/common'
import { type Either, left, right } from '../../../../core/either'
import {
  type CargoUniformeRow,
  UniformeRepository,
} from '../repositories/uniforme-repository'
import { VinculoJaExisteError } from './errors/vinculo-ja-existe.error'

export interface CreateCargoUniformeRequest {
  cargo_id: number
  uniforme_id: number
  periodicidade_troca_dias?: number | null
  quantidade_padrao?: number | null
  obrigatorio?: boolean
}

type CreateCargoUniformeResponse = Either<
  VinculoJaExisteError,
  { vinculo: CargoUniformeRow }
>

@Injectable()
export class CreateCargoUniformeUseCase {
  constructor(private repo: UniformeRepository) {}

  async execute(
    req: CreateCargoUniformeRequest,
  ): Promise<CreateCargoUniformeResponse> {
    try {
      const vinculo = await this.repo.createCargoUniforme({
        cargo_id: Number(req.cargo_id),
        uniforme_id: Number(req.uniforme_id),
        periodicidade_troca_dias: Number(req.periodicidade_troca_dias) || 365,
        quantidade_padrao: Number(req.quantidade_padrao) || 1,
        obrigatorio: req.obrigatorio !== false,
      })
      return right({ vinculo })
    } catch (error) {
      const msg = error instanceof Error ? error.message : ''
      if (msg.includes('Unique constraint')) {
        return left(new VinculoJaExisteError())
      }
      throw error
    }
  }
}
