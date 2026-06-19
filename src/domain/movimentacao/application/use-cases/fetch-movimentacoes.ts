import { Injectable } from '@nestjs/common'
import { type Either, right } from '../../../../core/either'
import {
  type FetchMovimentacoesResult,
  type MovimentacaoFiltros,
  MovimentacaoRepository,
} from '../repositories/movimentacao-repository'

type FetchMovimentacoesUseCaseResponse = Either<null, FetchMovimentacoesResult>

@Injectable()
export class FetchMovimentacoesUseCase {
  constructor(private movimentacaoRepository: MovimentacaoRepository) {}

  async execute(
    filtros: MovimentacaoFiltros,
  ): Promise<FetchMovimentacoesUseCaseResponse> {
    const result = await this.movimentacaoRepository.findAll(filtros)
    return right(result)
  }
}
