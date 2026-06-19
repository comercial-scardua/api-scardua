import { Injectable } from '@nestjs/common'
import type { relatorios } from '@prisma/client'
import { type Either, left, right } from '../../../../core/either'
import {
  RelatoriosRepository,
  type UpdateRelatorioData,
} from '../repositories/relatorios-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface EditRelatorioUseCaseRequest {
  relatorioId: number
  data: UpdateRelatorioData
}

type EditRelatorioUseCaseResponse = Either<
  ResourceNotFoundError,
  { relatorio: relatorios }
>

@Injectable()
export class EditRelatorioUseCase {
  constructor(private relatoriosRepository: RelatoriosRepository) {}

  async execute({
    relatorioId,
    data,
  }: EditRelatorioUseCaseRequest): Promise<EditRelatorioUseCaseResponse> {
    const exists = await this.relatoriosRepository.findById(relatorioId)

    if (!exists) {
      return left(new ResourceNotFoundError())
    }

    const relatorio = await this.relatoriosRepository.update(relatorioId, data)
    return right({ relatorio })
  }
}
