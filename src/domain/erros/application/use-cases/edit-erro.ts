import { Injectable } from '@nestjs/common'
import type { erros_solucoes } from '@prisma/client'
import { type Either, left, right } from '../../../../core/either'
import {
  ErrosRepository,
  type UpdateErroData,
} from '../repositories/erros-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface EditErroUseCaseRequest {
  erroId: number
  data: UpdateErroData
}

type EditErroUseCaseResponse = Either<
  ResourceNotFoundError,
  { erro: erros_solucoes }
>

@Injectable()
export class EditErroUseCase {
  constructor(private errosRepository: ErrosRepository) {}

  async execute({
    erroId,
    data,
  }: EditErroUseCaseRequest): Promise<EditErroUseCaseResponse> {
    const exists = await this.errosRepository.findById(erroId)

    if (!exists) {
      return left(new ResourceNotFoundError())
    }

    const erro = await this.errosRepository.update(erroId, data)
    return right({ erro })
  }
}
