import type { UseCaseError } from '../../../../../core/errors/use-case-error'

export class SaidaNaoEncontradaError extends Error implements UseCaseError {
  constructor(id: number) {
    super(`Saída #${id} não encontrada`)
    this.name = 'SaidaNaoEncontradaError'
  }
}
