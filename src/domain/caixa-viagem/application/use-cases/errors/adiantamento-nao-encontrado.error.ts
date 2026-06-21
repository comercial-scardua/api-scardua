import type { UseCaseError } from '../../../../../core/errors/use-case-error'

export class AdiantamentoNaoEncontradoError
  extends Error
  implements UseCaseError
{
  constructor(id: number) {
    super(`Adiantamento #${id} não encontrado`)
    this.name = 'AdiantamentoNaoEncontradoError'
  }
}
