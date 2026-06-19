import type { UseCaseError } from '../../../../../core/errors/use-case-error'

export class CpfJaCadastradoError extends Error implements UseCaseError {
  constructor(cpf: string) {
    super(`CPF "${cpf}" já está cadastrado`)
    this.name = 'CpfJaCadastradoError'
  }
}
