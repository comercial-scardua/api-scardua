export class ProdutoNaoEncontradoError extends Error {
  constructor(id: number) {
    super(`Produto #${id} não encontrado`);
    this.name = 'ProdutoNaoEncontradoError';
  }
}
