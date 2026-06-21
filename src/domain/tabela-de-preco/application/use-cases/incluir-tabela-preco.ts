import { Injectable } from '@nestjs/common'
import { type Either, right } from '../../../../core/either'
import type { TabelaPrecoItem } from '../repositories/tabela-de-preco-repository'
import { TabelaDePrecoRepository } from '../repositories/tabela-de-preco-repository'

export interface IncluirTabelaPrecoRequest {
  userId: string
  empresaId: number
  empresaNome: string
  descricao?: string | null
  itens: TabelaPrecoItem[]
}

type IncluirTabelaPrecoResponse = Either<
  never,
  { total: number; registros: unknown[] }
>

@Injectable()
export class IncluirTabelaPrecoUseCase {
  constructor(private repo: TabelaDePrecoRepository) {}

  async execute(
    req: IncluirTabelaPrecoRequest,
  ): Promise<IncluirTabelaPrecoResponse> {
    const result = await this.repo.incluir({
      userId: req.userId,
      empresaId: req.empresaId,
      empresaNome: req.empresaNome,
      descricao: req.descricao,
      itens: req.itens,
    })

    return right(result)
  }
}
