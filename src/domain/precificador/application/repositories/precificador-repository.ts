export interface SalvarPrecificacaoData {
  userId: string
  empresaId: number
  empresaNome: string
  produtoCodigo: string
  produtoNome: string
  posicaoFiscal?: string | null
  tipoPrecoBase: string
  custoBase: number
  custosFixosPerc: number
  outrosCustosCompraPerc: number
  outrosCustosVendaPerc: number
  lucroPercDesejado: number
  ncmCodigo?: string | null
  ncmCategoria?: string | null
  vendaFora: boolean
  precoFinal: number
  lucroLiquido: number
  margemLiquida: number
}

export interface AtualizarPrecoItem {
  produtoId: number
  preco: number
}

export interface AtualizarPrecosData {
  itens: AtualizarPrecoItem[]
}

export interface AtualizarPrecosResult {
  total: number
  resultados: {
    produtoId: number
    status: string
    preco?: number
    erro?: string
  }[]
}

export abstract class PrecificadorRepository {
  abstract buscarProduto(q?: string, codigo?: string): Promise<any[]>
  abstract buscarNcm(ncm?: string): Promise<any[]>
  abstract buscarFornecedor(fornecedor?: string): Promise<any[]>
  abstract buscarNf(nf?: string, fornecedor?: string): Promise<any[]>
  abstract buscarNfImportacao(nf?: string): Promise<any[]>
  abstract historico(
    produtoId?: number,
    page?: number,
    limit?: number,
  ): Promise<any>
  abstract salvar(data: SalvarPrecificacaoData): Promise<any>
  abstract atualizarPrecos(
    data: AtualizarPrecosData,
  ): Promise<AtualizarPrecosResult>
}
