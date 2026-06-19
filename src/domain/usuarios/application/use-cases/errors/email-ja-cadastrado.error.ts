import type { UseCaseError } from '../../../../../core/errors/use-case-error'

export class EmailJaCadastradoError extends Error implements UseCaseError {
  constructor(email: string) {
    super(`E-mail "${email}" já está cadastrado`)
    this.name = 'EmailJaCadastradoError'
  }
}
