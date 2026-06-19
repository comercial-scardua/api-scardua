import { Injectable } from '@nestjs/common'
import { type Either, right } from '../../../../core/either'
import { UsuariosRepository } from '../repositories/usuarios-repository'

type PermissaoFlags = {
  canAccess: boolean
  canEdit: boolean
  canDelete: boolean
}
type PermissoesMap = Record<string, Record<string, PermissaoFlags>>

interface GetUsuarioPermissionsUseCaseRequest {
  userId?: string
}

type GetUsuarioPermissionsUseCaseResponse = Either<null, PermissoesMap>

@Injectable()
export class GetUsuarioPermissionsUseCase {
  constructor(private usuariosRepository: UsuariosRepository) {}

  async execute({
    userId,
  }: GetUsuarioPermissionsUseCaseRequest): Promise<GetUsuarioPermissionsUseCaseResponse> {
    const perms = await this.usuariosRepository.findPermissions(userId)

    const result: PermissoesMap = {}
    for (const p of perms) {
      if (!result[p.userId]) result[p.userId] = {}
      result[p.userId][p.page] = {
        canAccess: p.canAccess,
        canEdit: p.canEdit,
        canDelete: p.canDelete,
      }
    }

    return right(result)
  }
}
