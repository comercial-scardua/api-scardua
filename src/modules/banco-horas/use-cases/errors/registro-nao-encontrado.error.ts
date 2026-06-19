export class RegistroNaoEncontradoError extends Error {
  constructor(id: number) {
    super(`Registro de ponto #${id} não encontrado`)
  }
}
