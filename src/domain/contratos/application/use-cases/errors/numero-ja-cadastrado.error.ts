import type { UseCaseError } from '../../../../../core/errors/use-case-error'

export class NumeroJaCadastradoError extends Error implements UseCaseError {
  constructor(numero: string) {
    super(`Já existe um contrato com o número "${numero}"`)
    this.name = 'NumeroJaCadastradoError'
  }
}
