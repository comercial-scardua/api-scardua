export class EstoqueInsuficienteError extends Error {
  constructor(disponivel: number, solicitado: number) {
    super(
      `Estoque insuficiente. Disponível: ${disponivel}, solicitado: ${solicitado}`,
    )
  }
}
