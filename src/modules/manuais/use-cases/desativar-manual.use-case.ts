import { Injectable } from '@nestjs/common'
import { type Either, left, right } from '../../../core/either'
import { ManuaisRepository } from '../repositories/manuais.repository'
import { ManualNaoEncontradoError } from './errors/manual-nao-encontrado.error'

type DesativarManualResult = Either<ManualNaoEncontradoError, null>

@Injectable()
export class DesativarManualUseCase {
  constructor(private repo: ManuaisRepository) {}

  async execute(id: number): Promise<DesativarManualResult> {
    const existe = await this.repo.findById(id)
    if (!existe) return left(new ManualNaoEncontradoError(id))

    await this.repo.desativar(id)
    return right(null)
  }
}
