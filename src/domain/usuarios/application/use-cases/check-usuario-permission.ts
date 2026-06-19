import { Injectable } from '@nestjs/common'
import { type Either, right } from '../../../../core/either'
import { UsuariosRepository } from '../repositories/usuarios-repository'

interface CheckUsuarioPermissionUseCaseRequest {
  userId: string
  role: string
  page: string
}

export interface CheckUsuarioPermissionResult {
  hasAccess: boolean
  page: string
  role: string
  permissions: {
    canAccess: boolean
    canEdit: boolean
    canDelete: boolean
  } | null
}

type CheckUsuarioPermissionUseCaseResponse = Either<
  null,
  CheckUsuarioPermissionResult
>

@Injectable()
export class CheckUsuarioPermissionUseCase {
  constructor(private usuariosRepository: UsuariosRepository) {}

  async execute({
    userId,
    role,
    page,
  }: CheckUsuarioPermissionUseCaseRequest): Promise<CheckUsuarioPermissionUseCaseResponse> {
    if (role === 'ADMIN') {
      return right({
        hasAccess: true,
        page,
        role: 'ADMIN',
        permissions: { canAccess: true, canEdit: true, canDelete: true },
      })
    }

    const perm = await this.usuariosRepository.findPermission(userId, page)

    return right({
      hasAccess: perm?.canAccess ?? false,
      page,
      role,
      permissions: perm
        ? {
            canAccess: perm.canAccess,
            canEdit: perm.canEdit,
            canDelete: perm.canDelete,
          }
        : null,
    })
  }
}
