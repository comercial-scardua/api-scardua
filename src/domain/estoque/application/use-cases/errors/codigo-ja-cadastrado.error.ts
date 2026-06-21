import type { UseCaseError } from '../../../../../core/errors/use-case-error'

export class CodigoJaCadastradoError extends Error implements UseCaseError {
  constructor(codigo: string) {
    super(`Código interno "${codigo}" já está cadastrado`)
    this.name = 'CodigoJaCadastradoError'
  }
}
