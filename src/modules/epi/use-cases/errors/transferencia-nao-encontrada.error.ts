export class TransferenciaNaoEncontradaError extends Error {
  constructor(id: number) {
    super(`Transferência ${id} não encontrada`)
  }
}
