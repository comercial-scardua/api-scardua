export class EpiNaoEncontradoError extends Error {
  constructor(id: number) {
    super(`EPI com id ${id} não encontrado`)
  }
}
