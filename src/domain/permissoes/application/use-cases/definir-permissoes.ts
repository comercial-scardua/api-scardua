import { Injectable } from '@nestjs/common'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { type Either, left, right } from '../../../../core/either'
import type {
  DefinirPermissoesData,
  PermissoesUsuario,
} from '../repositories/permissoes-repository'
import { PermissoesRepository } from '../repositories/permissoes-repository'
import { UsuarioNaoEncontradoError } from './errors/usuario-nao-encontrado.error'

type DefinirPermissoesResult = Either<
  UsuarioNaoEncontradoError,
  { permissions: PermissoesUsuario }
>

@Injectable()
export class DefinirPermissoesUseCase {
  constructor(private repo: PermissoesRepository) {}

  async execute(
    userId: string,
    data: DefinirPermissoesData,
  ): Promise<DefinirPermissoesResult> {
    const result = await this.repo.upsertBatch(userId, data)
    if (!result) return left(new UsuarioNaoEncontradoError(userId))

    PermissionsGuard.invalidate(userId)

    return right({ permissions: result })
  }
}
