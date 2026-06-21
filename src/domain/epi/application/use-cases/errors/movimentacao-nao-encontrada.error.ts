import type { UseCaseError } from '../../../../../core/errors/use-case-error'

export class MovimentacaoNaoEncontradaError
  extends Error
  implements UseCaseError
{
  constructor(id: number) {
    super(`Movimentação de estoque com id ${id} não encontrada`)
    this.name = 'MovimentacaoNaoEncontradaError'
  }
}
