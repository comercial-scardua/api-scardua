import type { UseCaseError } from '../../../../../core/errors/use-case-error'

export class NcmDuplicadoError extends Error implements UseCaseError {
  constructor() {
    super(
      'Já existe um NCM com essa combinação (Código + Categoria + Empresa + UF Emissor + UF Destino + CST Origem)',
    )
    this.name = 'NcmDuplicadoError'
  }
}
