import type { UseCaseError } from '../../../../../core/errors/use-case-error'

export class ContaNaoEncontradaError extends Error implements UseCaseError {
  constructor(id: number) {
    super(`Conta corrente #${id} não encontrada`)
    this.name = 'ContaNaoEncontradaError'
  }
}
