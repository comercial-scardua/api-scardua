import type { UseCaseError } from '../../../../../core/errors/use-case-error'

export class SaldoInsuficienteError extends Error implements UseCaseError {
  constructor(disponivel: number, solicitado: number) {
    super(
      `Saldo insuficiente: disponível ${disponivel}, solicitado ${solicitado}`,
    )
    this.name = 'SaldoInsuficienteError'
  }
}
