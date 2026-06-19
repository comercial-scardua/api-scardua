import { Injectable } from '@nestjs/common'
import type { permission } from '@prisma/client'
import { type Either, right } from '../../../../core/either'
import { UsuariosRepository } from '../repositories/usuarios-repository'

interface SetUsuarioPermissionUseCaseRequest {
  userId: string
  page: string
  canAccess?: boolean
  canEdit?: boolean
  canDelete?: boolean
}

type SetUsuarioPermissionUseCaseResponse = Either<
  null,
  { permission: permission }
>

@Injectable()
export class SetUsuarioPermissionUseCase {
  constructor(private usuariosRepository: UsuariosRepository) {}

  async execute({
    userId,
    page,
    canAccess = false,
    canEdit = false,
    canDelete = false,
  }: SetUsuarioPermissionUseCaseRequest): Promise<SetUsuarioPermissionUseCaseResponse> {
    const permission = await this.usuariosRepository.upsertPermission(
      userId,
      page,
      { canAccess, canEdit, canDelete },
    )
    return right({ permission })
  }
}
