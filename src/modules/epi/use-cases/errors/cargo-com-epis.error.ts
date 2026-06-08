export class CargoComEpisError extends Error {
  constructor(id: number) {
    super(`Cargo ${id} possui EPIs obrigatórios e não pode ser excluído`)
  }
}
