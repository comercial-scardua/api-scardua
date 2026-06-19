import type { UseCaseError } from '../../../../../core/errors/use-case-error'

export class EstoqueInsuficienteError extends Error implements UseCaseError {
  constructor(nome: string, disponivel: number) {
    super(`Estoque insuficiente para "${nome}". Disponível: ${disponivel}`)
    this.name = 'EstoqueInsuficienteError'
  }
}
