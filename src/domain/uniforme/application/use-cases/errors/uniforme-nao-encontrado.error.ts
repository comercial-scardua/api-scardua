import type { UseCaseError } from '../../../../../core/errors/use-case-error'

export class UniformeNaoEncontradoError extends Error implements UseCaseError {
  constructor() {
    super('Uniforme não encontrado')
    this.name = 'UniformeNaoEncontradoError'
  }
}
