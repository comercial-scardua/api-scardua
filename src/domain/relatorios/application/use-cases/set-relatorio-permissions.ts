import { Injectable } from '@nestjs/common'
import type { relatorio_permissions } from '@prisma/client'
import { type Either, left, right } from '../../../../core/either'
import { RelatoriosRepository } from '../repositories/relatorios-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface SetRelatorioPermissionsUseCaseRequest {
  relatorioId: number
  userIds: string[]
}

type SetRelatorioPermissionsUseCaseResponse = Either<
  ResourceNotFoundError,
  { permissions: relatorio_permissions[] }
>

@Injectable()
export class SetRelatorioPermissionsUseCase {
  constructor(private relatoriosRepository: RelatoriosRepository) {}

  async execute({
    relatorioId,
    userIds,
  }: SetRelatorioPermissionsUseCaseRequest): Promise<SetRelatorioPermissionsUseCaseResponse> {
    const exists = await this.relatoriosRepository.findById(relatorioId)

    if (!exists) {
      return left(new ResourceNotFoundError())
    }

    const permissions = await this.relatoriosRepository.setPermissions(
      relatorioId,
      userIds,
    )
    return right({ permissions })
  }
}
