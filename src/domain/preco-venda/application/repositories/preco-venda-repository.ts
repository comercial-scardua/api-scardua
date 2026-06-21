export interface ProdutoPrecoVenda {
  id: number
  descricao: string | null
  [key: string]: unknown
}

export interface IncluirPrecoVendaData {
  produtoId: number
  precoVenda: number
  observacao?: string | null
}

export interface ImportarPrecoVendaItem {
  produtoId: number
  precoVenda: number
}

export interface ImportarResultado {
  produtoId: number
  status: string
  precoVenda?: number
  erro?: string
}

export abstract class PrecoVendaRepository {
  abstract findProdutoById(id: number): Promise<ProdutoPrecoVenda | null>
  abstract updateProdutoDescricao(
    id: number,
    descricao: string,
  ): Promise<ProdutoPrecoVenda>
}
