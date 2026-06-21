import { Injectable } from '@nestjs/common'
import { right } from '../../../../core/either'
import { EstoqueRepository } from '../repositories/estoque-repository'

@Injectable()
export class FetchProdutosUseCase {
  constructor(private repo: EstoqueRepository) {}

  async execute(filters: {
    search?: string
    categoria?: string
    status?: string
    page?: number
    limit?: number
  }) {
    const result = await this.repo.findProdutos(filters)
    return right(result)
  }
}
