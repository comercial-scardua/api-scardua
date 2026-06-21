import { Injectable } from '@nestjs/common'
import { right } from '../../../../core/either'
import { EstoqueRepository } from '../repositories/estoque-repository'

@Injectable()
export class FetchSaidasUseCase {
  constructor(private repo: EstoqueRepository) {}

  async execute(filters: {
    produtoId?: number
    responsavel?: string
    motivo?: string
    dataInicio?: string
    dataFim?: string
    page?: number
    limit?: number
  }) {
    const result = await this.repo.findSaidas(filters)
    return right(result)
  }
}
