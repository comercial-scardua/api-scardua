export class SaldoInsuficienteError extends Error {
  constructor(disponivel: number, solicitado: number) {
    super(
      `Saldo insuficiente: disponível ${disponivel}, solicitado ${solicitado}`,
    )
    this.name = 'SaldoInsuficienteError'
  }
}
