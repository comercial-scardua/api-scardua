import type { UseCaseError } from '../../../../../core/errors/use-case-error'

export class ContratoNaoEncontradoError extends Error implements UseCaseError {
  constructor(id: number) {
    super(`Contrato #${id} não encontrado`)
    this.name = 'ContratoNaoEncontradoError'
  }
}
