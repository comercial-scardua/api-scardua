import type { UseCaseError } from '../../../../../core/errors/use-case-error'

export class EpiNaoEncontradoError extends Error implements UseCaseError {
  constructor(id: number) {
    super(`EPI com id ${id} não encontrado`)
    this.name = 'EpiNaoEncontradoError'
  }
}
