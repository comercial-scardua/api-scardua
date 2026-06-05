export class NcmNaoEncontradoError extends Error {
  constructor(id: number) {
    super(`NCM #${id} não encontrado`);
    this.name = 'NcmNaoEncontradoError';
  }
}
