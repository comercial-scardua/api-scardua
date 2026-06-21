import { Injectable } from '@nestjs/common'
import { type Either, right } from '../../../../core/either'
import type { TabelaPrecoItem } from '../repositories/tabela-de-preco-repository'
import { TabelaDePrecoRepository } from '../repositories/tabela-de-preco-repository'

export interface ImportarTabelaPrecoRequest {
  userId: string
  empresaId: number
  empresaNome: string
  itens: TabelaPrecoItem[]
}

type ImportarTabelaPrecoResponse = Either<
  never,
  { total: number; registros: unknown[] }
>

@Injectable()
export class ImportarTabelaPrecoUseCase {
  constructor(private repo: TabelaDePrecoRepository) {}

  async execute(
    req: ImportarTabelaPrecoRequest,
  ): Promise<ImportarTabelaPrecoResponse> {
    const result = await this.repo.importar({
      userId: req.userId,
      empresaId: req.empresaId,
      empresaNome: req.empresaNome,
      itens: req.itens,
    })

    return right(result)
  }
}
