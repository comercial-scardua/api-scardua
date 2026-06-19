import type { movimentacoes } from '@prisma/client'

export interface MovimentacaoFiltros {
  patrimonioId?: number
  tipo?: string
  dataInicio?: string
  dataFim?: string
  page?: number
  limit?: number
}

export interface CreateMovimentacaoData {
  patrimonioId: number
  tipo: string
  localizacaoNova?: string
  responsavelNovoId?: number
  kmNovo?: string
}

export interface FetchMovimentacoesResult {
  data: movimentacoes[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export abstract class MovimentacaoRepository {
  abstract findAll(
    filtros: MovimentacaoFiltros,
  ): Promise<FetchMovimentacoesResult>
  abstract create(
    data: CreateMovimentacaoData,
    autorId?: number,
  ): Promise<movimentacoes>
}
