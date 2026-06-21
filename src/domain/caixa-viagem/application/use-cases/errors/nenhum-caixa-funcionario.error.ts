import type { UseCaseError } from '../../../../../core/errors/use-case-error'

export class NenhumCaixaFuncionarioError extends Error implements UseCaseError {
  constructor(funcionarioId: number) {
    super(`Nenhum caixa encontrado para o funcionário #${funcionarioId}`)
    this.name = 'NenhumCaixaFuncionarioError'
  }
}
