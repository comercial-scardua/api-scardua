import type { UseCaseError } from '../../../../../core/errors/use-case-error'

export class ManualNaoEncontradoError extends Error implements UseCaseError {
  constructor(id: number) {
    super(`Manual #${id} não encontrado`)
    this.name = 'ManualNaoEncontradoError'
  }
}
