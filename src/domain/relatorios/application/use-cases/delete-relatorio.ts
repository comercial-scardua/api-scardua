import { Injectable } from '@nestjs/common'
import { type Either, left, right } from '../../../../core/either'
import { RelatoriosRepository } from '../repositories/relatorios-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface DeleteRelatorioUseCaseRequest {
  relatorioId: number
}

type DeleteRelatorioUseCaseResponse = Either<ResourceNotFoundError, null>

@Injectable()
export class DeleteRelatorioUseCase {
  constructor(private relatoriosRepository: RelatoriosRepository) {}

  async execute({
    relatorioId,
  }: DeleteRelatorioUseCaseRequest): Promise<DeleteRelatorioUseCaseResponse> {
    const exists = await this.relatoriosRepository.findById(relatorioId)

    if (!exists) {
      return left(new ResourceNotFoundError())
    }

    // Soft delete (ativo: false).
    await this.relatoriosRepository.softDelete(relatorioId)
    return right(null)
  }
}
