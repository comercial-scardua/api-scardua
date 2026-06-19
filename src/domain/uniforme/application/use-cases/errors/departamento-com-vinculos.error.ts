import type { UseCaseError } from '../../../../../core/errors/use-case-error'

export class DepartamentoComVinculosError
  extends Error
  implements UseCaseError
{
  constructor() {
    super(
      'Departamento possui uniformes vinculados. Remova os vínculos primeiro.',
    )
    this.name = 'DepartamentoComVinculosError'
  }
}
