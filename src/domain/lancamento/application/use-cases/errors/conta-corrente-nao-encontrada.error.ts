import type { UseCaseError } from '../../../../../core/errors/use-case-error'

export class ContaCorrenteNaoEncontradaError
  extends Error
  implements UseCaseError
{
  constructor(colaboradorId: number) {
    super(`Conta corrente para colaborador #${colaboradorId} não encontrada`)
    this.name = 'ContaCorrenteNaoEncontradaError'
  }
}
