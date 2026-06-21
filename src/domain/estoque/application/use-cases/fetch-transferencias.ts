import { Injectable } from '@nestjs/common'
import { right } from '../../../../core/either'
import { EstoqueRepository } from '../repositories/estoque-repository'

@Injectable()
export class FetchTransferenciasUseCase {
  constructor(private repo: EstoqueRepository) {}

  async execute(filters: {
    produtoId?: number
    empresaOrigemId?: number
    empresaDestinoId?: number
    dataInicio?: string
    dataFim?: string
    page?: number
    limit?: number
  }) {
    const result = await this.repo.findTransferencias(filters)
    return right(result)
  }
}
