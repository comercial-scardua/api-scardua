export class ContaNaoEncontradaError extends Error {
  constructor(id: number) {
    super(`Conta corrente #${id} não encontrada`)
    this.name = 'ContaNaoEncontradaError'
  }
}
