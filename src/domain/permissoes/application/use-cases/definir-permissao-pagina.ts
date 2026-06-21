import { Injectable } from '@nestjs/common'
import type { permission } from '@prisma/client'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { type Either, left, right } from '../../../../core/either'
import type { DefinirPermissaoPaginaData } from '../repositories/permissoes-repository'
import { PermissoesRepository } from '../repositories/permissoes-repository'
import { UsuarioNaoEncontradoError } from './errors/usuario-nao-encontrado.error'

type DefinirPermissaoPaginaResult = Either<
  UsuarioNaoEncontradoError,
  { permissao: permission }
>

@Injectable()
export class DefinirPermissaoPaginaUseCase {
  constructor(private repo: PermissoesRepository) {}

  async execute(
    userId: string,
    page: string,
    data: DefinirPermissaoPaginaData,
  ): Promise<DefinirPermissaoPaginaResult> {
    const permissao = await this.repo.upsertPagina(userId, page, data)
    if (!permissao) return left(new UsuarioNaoEncontradoError(userId))

    PermissionsGuard.invalidate(userId)

    return right({ permissao })
  }
}
