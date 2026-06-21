import { Injectable } from '@nestjs/common'
import { type Either, right } from '../../../../core/either'
import type { TabelaPrecoItem } from '../repositories/tabela-de-preco-repository'
import { TabelaDePrecoRepository } from '../repositories/tabela-de-preco-repository'

export interface AtualizarTabelaPrecoRequest {
  userId: string
  empresaId?: number
  empresaNome?: string
  descricao?: string | null
  itens?: TabelaPrecoItem[]
}

type AtualizarTabelaPrecoResponse = Either<
  never,
  { message?: string; total: number; registros?: unknown[] }
>

@Injectable()
export class AtualizarTabelaPrecoUseCase {
  constructor(private repo: TabelaDePrecoRepository) {}

  async execute(
    req: AtualizarTabelaPrecoRequest,
  ): Promise<AtualizarTabelaPrecoResponse> {
    if (!req.itens || req.itens.length === 0) {
      return right({
        message: 'Nenhum item fornecido para atualização',
        total: 0,
      })
    }

    const result = await this.repo.atualizar({
      userId: req.userId,
      empresaId: req.empresaId,
      empresaNome: req.empresaNome,
      descricao: req.descricao,
      itens: req.itens,
    })

    return right(result)
  }
}
