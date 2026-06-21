import type {
  products,
  stock_entries,
  stock_exits,
  stock_transfers,
} from '@prisma/client'

export type FiltrosPagina = {
  page?: number
  limit?: number
}

export type SaldoFilial = Record<number, Record<number, number>>

export interface CriarProdutoData {
  codigoInterno: string
  nome: string
  categoria: string
  unidade: string
  descricao?: string
  estoqueMinimo?: number
  status?: 'ATIVO' | 'INATIVO'
}

export interface CriarEntradaData {
  produtoId: number
  empresaId?: number | null
  quantidade: number
  dataEntrada: string
  numeroNotaFiscal?: string
  observacoes?: string
}

export interface CriarSaidaData {
  produtoId: number
  quantidade: number
  dataSaida: string
  responsavel: string
  motivo?: string
  observacoes?: string
  empresaId?: number | null
}

export interface CriarTransferenciaData {
  produtoId: number
  empresaOrigemId: number
  empresaDestinoId: number
  quantidade: number
  dataTransferencia: string
  responsavel: string
  observacoes?: string
}

export abstract class EstoqueRepository {
  // Produtos
  abstract findProdutos(
    filters: {
      search?: string
      categoria?: string
      status?: string
    } & FiltrosPagina,
  ): Promise<{ data: products[]; total: number; pages: number }>
  abstract findProdutoById(id: number): Promise<products | null>
  abstract findProdutoByCodigo(codigo: string): Promise<products | null>
  abstract criarProduto(
    data: CriarProdutoData,
    userId: string,
  ): Promise<products>
  abstract atualizarProduto(
    id: number,
    data: Partial<CriarProdutoData>,
  ): Promise<products>
  abstract desativarProduto(id: number): Promise<products>

  // Entradas
  abstract findEntradas(
    filters: {
      produtoId?: number
      numeroNotaFiscal?: string
      dataInicio?: string
      dataFim?: string
    } & FiltrosPagina,
  ): Promise<{ data: stock_entries[]; total: number; pages: number }>
  abstract findEntradaById(id: number): Promise<stock_entries | null>
  abstract criarEntrada(
    data: CriarEntradaData,
    userId: string,
    arquivoUrl?: string,
  ): Promise<stock_entries>
  abstract updateEntrada(
    id: number,
    data: Record<string, unknown>,
  ): Promise<stock_entries>
  abstract excluirEntrada(id: number): Promise<void>

  // Saidas
  abstract findSaidas(
    filters: {
      produtoId?: number
      responsavel?: string
      motivo?: string
      dataInicio?: string
      dataFim?: string
    } & FiltrosPagina,
  ): Promise<{ data: stock_exits[]; total: number; pages: number }>
  abstract findSaidaById(id: number): Promise<stock_exits | null>
  abstract criarSaida(
    data: CriarSaidaData,
    userId: string,
  ): Promise<stock_exits>
  abstract updateSaida(
    id: number,
    data: Record<string, unknown>,
  ): Promise<stock_exits>
  abstract excluirSaida(id: number): Promise<void>

  // Transferencias
  abstract findTransferencias(
    filters: {
      produtoId?: number
      empresaOrigemId?: number
      empresaDestinoId?: number
      dataInicio?: string
      dataFim?: string
    } & FiltrosPagina,
  ): Promise<{ data: stock_transfers[]; total: number; pages: number }>
  abstract findTransferenciaById(id: number): Promise<stock_transfers | null>
  abstract criarTransferencia(
    data: CriarTransferenciaData,
    userId: string,
  ): Promise<stock_transfers>
  abstract updateTransferencia(
    id: number,
    data: Record<string, unknown>,
  ): Promise<stock_transfers>

  // Empresas
  abstract findEmpresas(): Promise<
    {
      id: number
      nomeEmpresa: string
      cnpj: string | null
      cidade: string | null
    }[]
  >

  // Saldos
  abstract saldoFiliais(
    produtoId?: number,
    empresaId?: number,
  ): Promise<SaldoFilial>
  abstract saldoProdutoNaFilial(
    produtoId: number,
    empresaId: number,
  ): Promise<number>

  // Dashboard
  abstract dashboard(): Promise<{
    resumo: {
      totalProdutos: number
      produtosAtivos: number
      produtosAbaixoMinimo: number
    }
    movimentacaoMes: {
      entradasQuantidade: number
      saidasQuantidade: number
      totalEntradasUnidades: number
      totalSaidasUnidades: number
      saldoLiquidoUnidades: number
    }
    produtosCriticos: products[]
  }>
}
