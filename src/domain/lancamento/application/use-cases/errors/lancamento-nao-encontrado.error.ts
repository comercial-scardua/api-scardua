import type { UseCaseError } from '../../../../../core/errors/use-case-error'

export class LancamentoNaoEncontradoError
  extends Error
  implements UseCaseError
{
  constructor(lancamentoId: number) {
    super(`Lançamento #${lancamentoId} não encontrado para este usuário`)
    this.name = 'LancamentoNaoEncontradoError'
  }
}
