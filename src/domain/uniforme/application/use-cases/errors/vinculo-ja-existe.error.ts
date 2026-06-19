import type { UseCaseError } from '../../../../../core/errors/use-case-error'

export class VinculoJaExisteError extends Error implements UseCaseError {
  constructor() {
    super('Uniforme já vinculado a este cargo')
    this.name = 'VinculoJaExisteError'
  }
}
