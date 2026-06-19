import { Injectable } from '@nestjs/common'
import { type Either, right } from '../../../../core/either'
import { UsuariosRepository } from '../repositories/usuarios-repository'

interface CheckUsuarioPermissionDebugUseCaseRequest {
  userId: string
  role: string
}

@Injectable()
export class CheckUsuarioPermissionDebugUseCase {
  constructor(private usuariosRepository: UsuariosRepository) {}

  async execute({
    userId,
    role,
  }: CheckUsuarioPermissionDebugUseCaseRequest): Promise<
    Either<
      null,
      {
        userId: string
        role: string
        isAdmin: boolean
        totalPermissoes: number
        permissoes: {
          page: string
          canAccess: boolean
          canEdit: boolean
          canDelete: boolean
        }[]
      }
    >
  > {
    const perms = await this.usuariosRepository.findPermissions(userId)

    return right({
      userId,
      role,
      isAdmin: role === 'ADMIN',
      totalPermissoes: perms.length,
      permissoes: perms.map((p) => ({
        page: p.page,
        canAccess: p.canAccess,
        canEdit: p.canEdit,
        canDelete: p.canDelete,
      })),
    })
  }
}
