import type { UseCaseError } from '../../../../../core/errors/use-case-error'

export class RegistroNaoEncontradoError extends Error implements UseCaseError {
  constructor(id: number) {
    super(`Registro de ponto #${id} não encontrado`)
    this.name = 'RegistroNaoEncontradoError'
  }
}
