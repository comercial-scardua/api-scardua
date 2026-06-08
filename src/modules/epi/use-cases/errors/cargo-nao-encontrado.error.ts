export class CargoNaoEncontradoError extends Error {
  constructor(id: number) {
    super(`Cargo EPI com id ${id} não encontrado`)
  }
}
