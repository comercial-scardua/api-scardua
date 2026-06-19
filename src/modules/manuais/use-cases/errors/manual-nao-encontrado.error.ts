export class ManualNaoEncontradoError extends Error {
  constructor(id: number) {
    super(`Manual #${id} não encontrado`)
    this.name = 'ManualNaoEncontradoError'
  }
}
