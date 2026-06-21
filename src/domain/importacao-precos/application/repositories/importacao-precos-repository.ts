export interface ImportarPrecosItem {
  codigoInterno: string
  nome: string
  categoria: string
  descricao?: string | null
  unidade: string
  estoqueMinimo?: number
  estoqueAtual?: number
  status?: 'ATIVO' | 'INATIVO'
}

export interface ImportarPrecosData {
  produtos: ImportarPrecosItem[]
}

export interface ImportarPrecosResult {
  total: number
  resultados: { codigoInterno: string; acao: string }[]
}

export abstract class ImportacaoPrecosRepository {
  abstract importar(data: ImportarPrecosData): Promise<ImportarPrecosResult>
  abstract exportar(
    categoria?: string,
    grupo?: string,
    marca?: string,
  ): Promise<any[]>
  abstract categorias(): Promise<(string | null)[]>
  abstract grupos(): Promise<string[]>
  abstract marcas(): Promise<string[]>
}
