import type { UseCaseError } from '../../../../../core/errors/use-case-error'

export class EstoqueInsuficienteError extends Error implements UseCaseError {
  constructor(disponivel: number, solicitado: number) {
    super(
      `Estoque insuficiente: disponível ${disponivel}, solicitado ${solicitado}`,
    )
    this.name = 'EstoqueInsuficienteError'
  }
}
