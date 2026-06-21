import type { UseCaseError } from '../../../../../core/errors/use-case-error'

export class PermissaoNaoEncontradaError extends Error implements UseCaseError {
  constructor(userId: string, page: string) {
    super(
      `Permissão da página "${page}" não encontrada para o usuário "${userId}"`,
    )
    this.name = 'PermissaoNaoEncontradaError'
  }
}
