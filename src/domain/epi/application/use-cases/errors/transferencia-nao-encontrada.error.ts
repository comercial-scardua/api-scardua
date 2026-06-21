import type { UseCaseError } from '../../../../../core/errors/use-case-error'

export class TransferenciaNaoEncontradaError
  extends Error
  implements UseCaseError
{
  constructor(id: number) {
    super(`Transferência com id ${id} não encontrada`)
    this.name = 'TransferenciaNaoEncontradaError'
  }
}
