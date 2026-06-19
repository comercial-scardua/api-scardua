export class ColaboradorNaoEncontradoBancoHorasError extends Error {
  constructor(id: number) {
    super(`Colaborador #${id} não encontrado para banco de horas`)
  }
}
