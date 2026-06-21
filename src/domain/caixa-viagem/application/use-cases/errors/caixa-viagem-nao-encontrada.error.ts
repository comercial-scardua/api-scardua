import type { UseCaseError } from '../../../../../core/errors/use-case-error'

export class CaixaViagemNaoEncontradaError
  extends Error
  implements UseCaseError
{
  constructor(id: number) {
    super(`Caixa de viagem #${id} não encontrado`)
    this.name = 'CaixaViagemNaoEncontradaError'
  }
}
