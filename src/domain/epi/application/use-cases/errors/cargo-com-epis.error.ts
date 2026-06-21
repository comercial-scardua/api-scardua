import type { UseCaseError } from '../../../../../core/errors/use-case-error'

export class CargoComEpisError extends Error implements UseCaseError {
  constructor(id: number) {
    super(`Cargo ${id} possui EPIs obrigatórios e não pode ser excluído`)
    this.name = 'CargoComEpisError'
  }
}
