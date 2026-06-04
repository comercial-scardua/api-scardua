export class ColaboradorNaoEncontradoError extends Error {
  constructor(id: number) {
    super(`Colaborador #${id} não encontrado`);
    this.name = 'ColaboradorNaoEncontradoError';
  }
}
