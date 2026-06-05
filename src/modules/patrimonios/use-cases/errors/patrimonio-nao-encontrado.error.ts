export class PatrimonioNaoEncontradoError extends Error {
  constructor(id: number) {
    super(`Patrimônio #${id} não encontrado`);
    this.name = 'PatrimonioNaoEncontradoError';
  }
}
