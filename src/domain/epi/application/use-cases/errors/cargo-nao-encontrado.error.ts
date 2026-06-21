import type { UseCaseError } from '../../../../../core/errors/use-case-error'

export class CargoNaoEncontradoError extends Error implements UseCaseError {
  constructor(id: number) {
    super(`Cargo EPI com id ${id} não encontrado`)
    this.name = 'CargoNaoEncontradoError'
  }
}
