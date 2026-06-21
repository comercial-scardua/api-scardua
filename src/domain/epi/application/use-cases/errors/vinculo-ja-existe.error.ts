import type { UseCaseError } from '../../../../../core/errors/use-case-error'

export class VinculoJaExisteError extends Error implements UseCaseError {
  constructor() {
    super('Vínculo EPI × Cargo já existe')
    this.name = 'VinculoJaExisteError'
  }
}
