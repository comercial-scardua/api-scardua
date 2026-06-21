import type { UseCaseError } from '../../../../../core/errors/use-case-error'

export class ProdutoNaoEncontradoError extends Error implements UseCaseError {
  constructor(produtoId: number) {
    super(`Produto #${produtoId} nao encontrado`)
    this.name = 'ProdutoNaoEncontradoError'
  }
}
