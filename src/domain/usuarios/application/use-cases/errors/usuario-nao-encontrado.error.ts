import type { UseCaseError } from '../../../../../core/errors/use-case-error'

export class UsuarioNaoEncontradoError extends Error implements UseCaseError {
  constructor(id: string) {
    super(`Usuário "${id}" não encontrado`)
    this.name = 'UsuarioNaoEncontradoError'
  }
}
