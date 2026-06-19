import { Injectable } from '@nestjs/common'
import { type Either, right } from '../../../../core/either'
import {
  type UpsertPermissionData,
  UsuariosRepository,
} from '../repositories/usuarios-repository'

interface UpdateUsuarioPermissionsUseCaseRequest {
  userId: string
  permissions: Record<string, UpsertPermissionData>
}

type UpdateUsuarioPermissionsUseCaseResponse = Either<null, { userId: string }>

@Injectable()
export class UpdateUsuarioPermissionsUseCase {
  constructor(private usuariosRepository: UsuariosRepository) {}

  async execute({
    userId,
    permissions,
  }: UpdateUsuarioPermissionsUseCaseRequest): Promise<UpdateUsuarioPermissionsUseCaseResponse> {
    for (const [page, perms] of Object.entries(permissions)) {
      await this.usuariosRepository.upsertPermission(userId, page, perms)
    }
    return right({ userId })
  }
}
