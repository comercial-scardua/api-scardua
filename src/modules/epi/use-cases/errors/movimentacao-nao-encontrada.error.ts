export class MovimentacaoNaoEncontradaError extends Error {
  constructor(id: number) {
    super(`Movimentação ${id} não encontrada`)
  }
}
