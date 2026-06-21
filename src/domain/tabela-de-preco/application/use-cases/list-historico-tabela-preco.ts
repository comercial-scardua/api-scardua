import { Injectable } from '@nestjs/common'
import { type Either, right } from '../../../../core/either'
import {
  type HistoricoResult,
  TabelaDePrecoRepository,
} from '../repositories/tabela-de-preco-repository'

export interface ListHistoricoRequest {
  empresaId?: number
  page?: number
  limit?: number
}

type ListHistoricoTabelaPrecoResponse = Either<never, HistoricoResult>

@Injectable()
export class ListHistoricoTabelaPrecoUseCase {
  constructor(private repo: TabelaDePrecoRepository) {}

  async execute(
    req: ListHistoricoRequest,
  ): Promise<ListHistoricoTabelaPrecoResponse> {
    const result = await this.repo.historico({
      empresaId: req.empresaId,
      page: req.page,
      limit: req.limit,
    })

    return right(result)
  }
}
