import { Injectable } from '@nestjs/common'
import { type Either, right } from '../../../../core/either'
import { TabelaDePrecoRepository } from '../repositories/tabela-de-preco-repository'

export interface LimparHistoricoRequest {
  ids?: number[]
}

type LimparHistoricoTabelaPrecoResponse = Either<
  never,
  { deletados: number; mensagem: string }
>

@Injectable()
export class LimparHistoricoTabelaPrecoUseCase {
  constructor(private repo: TabelaDePrecoRepository) {}

  async execute(
    req: LimparHistoricoRequest,
  ): Promise<LimparHistoricoTabelaPrecoResponse> {
    const result = await this.repo.limparHistorico(req.ids)
    return right(result)
  }
}
