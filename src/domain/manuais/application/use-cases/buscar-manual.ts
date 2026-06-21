import { Injectable } from '@nestjs/common'
import { type Either, left, right } from '../../../../core/either'
import {
  ManuaisRepository,
  type ManualCompleto,
} from '../repositories/manuais-repository'
import { ManualNaoEncontradoError } from './errors/manual-nao-encontrado.error'

interface BuscarManualUseCaseRequest {
  manualId: number
}

type BuscarManualUseCaseResponse = Either<
  ManualNaoEncontradoError,
  { manual: ManualCompleto }
>

@Injectable()
export class BuscarManualUseCase {
  constructor(private manuaisRepository: ManuaisRepository) {}

  async execute({
    manualId,
  }: BuscarManualUseCaseRequest): Promise<BuscarManualUseCaseResponse> {
    const manual = await this.manuaisRepository.findById(manualId)
    if (!manual) return left(new ManualNaoEncontradoError(manualId))
    return right({ manual })
  }
}
