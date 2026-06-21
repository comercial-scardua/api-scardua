import type { UseCaseError } from '../../../../../core/errors/use-case-error'

export class CaixaViagemNaoEncontradaError
  extends Error
  implements UseCaseError
{
  constructor(colaboradorId: number) {
    super(
      `Caixa viagem ativo para colaborador #${colaboradorId} não encontrado`,
    )
    this.name = 'CaixaViagemNaoEncontradaError'
  }
}
