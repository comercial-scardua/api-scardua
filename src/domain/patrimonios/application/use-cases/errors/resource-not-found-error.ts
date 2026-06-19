import type { UseCaseError } from '../../../../../core/errors/use-case-error'

export class ResourceNotFoundError extends Error implements UseCaseError {
  constructor(id?: number) {
    super(
      id !== undefined
        ? `Patrimônio #${id} não encontrado`
        : 'Recurso não encontrado.',
    )
  }
}
