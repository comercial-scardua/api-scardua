import { Injectable } from '@nestjs/common'
import { type Either, left, right } from '../../../../core/either'
import { ManuaisRepository } from '../repositories/manuais-repository'
import { ManualNaoEncontradoError } from './errors/manual-nao-encontrado.error'

interface DesativarManualUseCaseRequest {
  manualId: number
}

type DesativarManualUseCaseResponse = Either<ManualNaoEncontradoError, null>

@Injectable()
export class DesativarManualUseCase {
  constructor(private manuaisRepository: ManuaisRepository) {}

  async execute({
    manualId,
  }: DesativarManualUseCaseRequest): Promise<DesativarManualUseCaseResponse> {
    const existe = await this.manuaisRepository.findById(manualId)
    if (!existe) return left(new ManualNaoEncontradoError(manualId))

    await this.manuaisRepository.desativar(manualId)
    return right(null)
  }
}
