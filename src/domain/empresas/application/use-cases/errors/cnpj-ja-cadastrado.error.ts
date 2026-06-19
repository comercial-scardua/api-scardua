import type { UseCaseError } from '../../../../../core/errors/use-case-error'

export class CnpjJaCadastradoError extends Error implements UseCaseError {
  constructor(cnpj: string) {
    super(`CNPJ "${cnpj}" já está cadastrado`)
    this.name = 'CnpjJaCadastradoError'
  }
}
