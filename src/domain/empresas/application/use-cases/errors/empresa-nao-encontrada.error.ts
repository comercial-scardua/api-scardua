import type { UseCaseError } from '../../../../../core/errors/use-case-error'

export class EmpresaNaoEncontradaError extends Error implements UseCaseError {
  constructor(id: number) {
    super(`Empresa #${id} não encontrada`)
    this.name = 'EmpresaNaoEncontradaError'
  }
}
