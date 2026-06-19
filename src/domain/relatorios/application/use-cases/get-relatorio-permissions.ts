import { Injectable } from '@nestjs/common'
import type { relatorio_permissions } from '@prisma/client'
import { type Either, left, right } from '../../../../core/either'
import { RelatoriosRepository } from '../repositories/relatorios-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface GetRelatorioPermissionsUseCaseRequest {
  relatorioId: number
}

type GetRelatorioPermissionsUseCaseResponse = Either<
  ResourceNotFoundError,
  { permissions: relatorio_permissions[] }
>

@Injectable()
export class GetRelatorioPermissionsUseCase {
  constructor(private relatoriosRepository: RelatoriosRepository) {}

  async execute({
    relatorioId,
  }: GetRelatorioPermissionsUseCaseRequest): Promise<GetRelatorioPermissionsUseCaseResponse> {
    const exists = await this.relatoriosRepository.findById(relatorioId)

    if (!exists) {
      return left(new ResourceNotFoundError())
    }

    const permissions =
      await this.relatoriosRepository.getPermissions(relatorioId)
    return right({ permissions })
  }
}
