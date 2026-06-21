import type { UseCaseError } from '../../../../../core/errors/use-case-error'

export class UsuarioNaoEncontradoError extends Error implements UseCaseError {
  constructor(userId: string) {
    super(`Usuário "${userId}" não encontrado`)
    this.name = 'UsuarioNaoEncontradoError'
  }
}
