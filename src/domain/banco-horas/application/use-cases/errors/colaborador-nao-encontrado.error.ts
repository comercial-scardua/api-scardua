import type { UseCaseError } from '../../../../../core/errors/use-case-error'

export class ColaboradorNaoEncontradoBancoHorasError
  extends Error
  implements UseCaseError
{
  constructor(id: number) {
    super(`Colaborador #${id} não encontrado para banco de horas`)
    this.name = 'ColaboradorNaoEncontradoBancoHorasError'
  }
}
