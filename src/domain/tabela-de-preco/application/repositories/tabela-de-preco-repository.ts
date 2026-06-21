export interface TabelaPrecoItem {
  produtoCodigo: string
  produtoNome: string
  precoVenda: number
  precoBase?: number
  observacao?: string | null
}

export interface IncluirTabelaPrecoData {
  userId: string
  empresaId: number
  empresaNome: string
  descricao?: string | null
  itens: TabelaPrecoItem[]
}

export interface ImportarTabelaPrecoData {
  userId: string
  empresaId: number
  empresaNome: string
  itens: TabelaPrecoItem[]
}

export interface AtualizarTabelaPrecoData {
  userId: string
  empresaId?: number
  empresaNome?: string
  descricao?: string | null
  itens?: TabelaPrecoItem[]
}

export interface HistoricoFilters {
  empresaId?: number
  page?: number
  limit?: number
}

export interface HistoricoResult {
  total: number
  page: number
  limit: number
  pages: number
  dados: unknown[]
}

export abstract class TabelaDePrecoRepository {
  abstract incluir(
    data: IncluirTabelaPrecoData,
  ): Promise<{ total: number; registros: unknown[] }>

  abstract importar(
    data: ImportarTabelaPrecoData,
  ): Promise<{ total: number; registros: unknown[] }>

  abstract atualizar(
    data: AtualizarTabelaPrecoData,
  ): Promise<{ total: number; registros: unknown[] }>

  abstract historico(filters: HistoricoFilters): Promise<HistoricoResult>

  abstract limparHistorico(
    ids?: number[],
  ): Promise<{ deletados: number; mensagem: string }>
}
