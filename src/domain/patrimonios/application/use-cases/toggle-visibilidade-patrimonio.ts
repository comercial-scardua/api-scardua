import { Injectable } from '@nestjs/common'
import { type Either, left, right } from '../../../../core/either'
import { PatrimoniosRepository } from '../repositories/patrimonios-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface ToggleVisibilidadePatrimonioUseCaseRequest {
  patrimonioId: number
}

type ToggleVisibilidadePatrimonioUseCaseResponse = Either<
  ResourceNotFoundError,
  { oculto: boolean }
>

@Injectable()
export class ToggleVisibilidadePatrimonioUseCase {
  constructor(private patrimoniosRepository: PatrimoniosRepository) {}

  async execute({
    patrimonioId,
  }: ToggleVisibilidadePatrimonioUseCaseRequest): Promise<ToggleVisibilidadePatrimonioUseCaseResponse> {
    const existe = await this.patrimoniosRepository.findById(patrimonioId)
    if (!existe) return left(new ResourceNotFoundError(patrimonioId))

    const atualizado =
      await this.patrimoniosRepository.toggleOculto(patrimonioId)
    return right({ oculto: atualizado.oculto })
  }
}
