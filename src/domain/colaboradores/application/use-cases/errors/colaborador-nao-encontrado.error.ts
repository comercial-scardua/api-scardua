import type { UseCaseError } from '../../../../../core/errors/use-case-error'

export class ColaboradorNaoEncontradoError
  extends Error
  implements UseCaseError
{
  constructor(id: number) {
    super(`Colaborador #${id} não encontrado`)
    this.name = 'ColaboradorNaoEncontradoError'
  }
}
