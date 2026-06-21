import type { UseCaseError } from '../../../../../core/errors/use-case-error'

export class ProdutoNaoEncontradoError extends Error implements UseCaseError {
  constructor(id: number) {
    super(`Produto #${id} não encontrado`)
    this.name = 'ProdutoNaoEncontradoError'
  }
}
