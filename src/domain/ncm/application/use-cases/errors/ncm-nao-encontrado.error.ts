import type { UseCaseError } from '../../../../../core/errors/use-case-error'

export class NcmNaoEncontradoError extends Error implements UseCaseError {
  constructor(id: number) {
    super(`NCM #${id} não encontrado`)
    this.name = 'NcmNaoEncontradoError'
  }
}
