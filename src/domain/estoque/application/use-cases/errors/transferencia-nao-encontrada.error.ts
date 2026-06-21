import type { UseCaseError } from '../../../../../core/errors/use-case-error'

export class TransferenciaNaoEncontradaError
  extends Error
  implements UseCaseError
{
  constructor(id: number) {
    super(`Transferência #${id} não encontrada`)
    this.name = 'TransferenciaNaoEncontradaError'
  }
}
