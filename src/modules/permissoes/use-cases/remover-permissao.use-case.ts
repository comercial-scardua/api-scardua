import { Injectable } from '@nestjs/common';
import { type Either, left, right } from '../../../core/either';
import { PermissionsGuard } from '../../../auth/guards/permissions.guard';
import { PermissoesRepository } from '../repositories/permissoes.repository';
import { PermissaoNaoEncontradaError } from './errors/permissao-nao-encontrada.error';

type RemoverPermissaoResult = Either<PermissaoNaoEncontradaError, null>;

@Injectable()
export class RemoverPermissaoUseCase {
  constructor(private repo: PermissoesRepository) {}

  async execute(
    userId: string,
    page: string,
  ): Promise<RemoverPermissaoResult> {
    const removida = await this.repo.remover(userId, page);
    if (!removida) return left(new PermissaoNaoEncontradaError(userId, page));

    PermissionsGuard.invalidate(userId);

    return right(null);
  }
}
