import { Injectable } from '@nestjs/common'
import { type Either, left, right } from '../../../../core/either'
import {
  type AtualizarManualData,
  ManuaisRepository,
  type ManualCompleto,
} from '../repositories/manuais-repository'
import { ManualNaoEncontradoError } from './errors/manual-nao-encontrado.error'

interface AtualizarManualUseCaseRequest {
  manualId: number
  data: AtualizarManualData
}

type AtualizarManualUseCaseResponse = Either<
  ManualNaoEncontradoError,
  { manual: ManualCompleto }
>

@Injectable()
export class AtualizarManualUseCase {
  constructor(private manuaisRepository: ManuaisRepository) {}

  async execute({
    manualId,
    data,
  }: AtualizarManualUseCaseRequest): Promise<AtualizarManualUseCaseResponse> {
    const existe = await this.manuaisRepository.findById(manualId)
    if (!existe) return left(new ManualNaoEncontradoError(manualId))

    const manual = await this.manuaisRepository.update(manualId, data)
    return right({ manual })
  }
}
