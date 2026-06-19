import { Injectable } from '@nestjs/common'
import type { relatorios } from '@prisma/client'
import { type Either, left, right } from '../../../../core/either'
import { RelatoriosRepository } from '../repositories/relatorios-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface GetRelatorioUseCaseRequest {
  relatorioId: number
}

type GetRelatorioUseCaseResponse = Either<
  ResourceNotFoundError,
  { relatorio: relatorios }
>

@Injectable()
export class GetRelatorioUseCase {
  constructor(private relatoriosRepository: RelatoriosRepository) {}

  async execute({
    relatorioId,
  }: GetRelatorioUseCaseRequest): Promise<GetRelatorioUseCaseResponse> {
    const relatorio = await this.relatoriosRepository.findById(relatorioId)

    if (!relatorio) {
      return left(new ResourceNotFoundError())
    }

    return right({ relatorio })
  }
}
