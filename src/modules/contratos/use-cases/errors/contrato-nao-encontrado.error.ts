export class ContratoNaoEncontradoError extends Error {
  constructor(id: number) {
    super(`Contrato #${id} não encontrado`);
    this.name = 'ContratoNaoEncontradoError';
  }
}
