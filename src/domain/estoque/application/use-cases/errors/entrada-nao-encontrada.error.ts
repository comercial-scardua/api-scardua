import type { UseCaseError } from '../../../../../core/errors/use-case-error'

export class EntradaNaoEncontradaError extends Error implements UseCaseError {
  constructor(id: number) {
    super(`Entrada #${id} não encontrada`)
    this.name = 'EntradaNaoEncontradaError'
  }
}
