import { Injectable } from '@nestjs/common'
import { type Either, left, right } from '../../../core/either'
import { ManuaisRepository } from '../repositories/manuais.repository'
import type { ManualCompleto } from '../repositories/manuais.repository'
import { ManualNaoEncontradoError } from './errors/manual-nao-encontrado.error'

type BuscarManualResult = Either<
  ManualNaoEncontradoError,
  { manual: ManualCompleto }
>

@Injectable()
export class BuscarManualUseCase {
  constructor(private repo: ManuaisRepository) {}

  async execute(id: number): Promise<BuscarManualResult> {
    const manual = await this.repo.findById(id)
    if (!manual) return left(new ManualNaoEncontradoError(id))
    return right({ manual })
  }
}
