import { Injectable } from '@nestjs/common'
import { right } from '../../../../core/either'
import { EstoqueRepository } from '../repositories/estoque-repository'

@Injectable()
export class FetchEntradasUseCase {
  constructor(private repo: EstoqueRepository) {}

  async execute(filters: {
    produtoId?: number
    numeroNotaFiscal?: string
    dataInicio?: string
    dataFim?: string
    page?: number
    limit?: number
  }) {
    const result = await this.repo.findEntradas(filters)
    return right(result)
  }
}
