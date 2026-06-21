import type { UseCaseError } from '../../../../../core/errors/use-case-error'

export class EpiComVinculosError extends Error implements UseCaseError {
  constructor(id: number) {
    super(`EPI ${id} possui vínculos e não pode ser excluído`)
    this.name = 'EpiComVinculosError'
  }
}
