import type { products, stock_entries, stock_exits, stock_transfers } from '@prisma/client';
import type { CriarEntradaDto } from '../dto/criar-entrada.dto';
import type { CriarProdutoDto } from '../dto/criar-produto.dto';
import type { CriarSaidaDto } from '../dto/criar-saida.dto';
import type { CriarTransferenciaDto } from '../dto/criar-transferencia.dto';

export type FiltrosPagina = {
  page?: number;
  limit?: number;
};

export type SaldoFilial = Record<number, Record<number, number>>;

export abstract class EstoqueRepository {
  // Produtos
  abstract findProdutos(filters: { search?: string; categoria?: string; status?: string } & FiltrosPagina): Promise<{ data: products[]; total: number; pages: number }>;
  abstract findProdutoById(id: number): Promise<products | null>;
  abstract findProdutoByCodigo(codigo: string): Promise<products | null>;
  abstract criarProduto(data: CriarProdutoDto, userId: string): Promise<products>;
  abstract atualizarProduto(id: number, data: Partial<CriarProdutoDto>): Promise<products>;
  abstract desativarProduto(id: number): Promise<products>;

  // Entradas
  abstract findEntradas(filters: { produtoId?: number; numeroNotaFiscal?: string; dataInicio?: string; dataFim?: string } & FiltrosPagina): Promise<{ data: stock_entries[]; total: number; pages: number }>;
  abstract criarEntrada(data: CriarEntradaDto, userId: string, arquivoUrl?: string): Promise<stock_entries>;

  // Saídas
  abstract findSaidas(filters: { produtoId?: number; responsavel?: string; motivo?: string; dataInicio?: string; dataFim?: string } & FiltrosPagina): Promise<{ data: stock_exits[]; total: number; pages: number }>;
  abstract criarSaida(data: CriarSaidaDto, userId: string): Promise<stock_exits>;

  // Transferências
  abstract findTransferencias(filters: { produtoId?: number; empresaOrigemId?: number; empresaDestinoId?: number; dataInicio?: string; dataFim?: string } & FiltrosPagina): Promise<{ data: stock_transfers[]; total: number; pages: number }>;
  abstract criarTransferencia(data: CriarTransferenciaDto, userId: string): Promise<stock_transfers>;

  // Saldos
  abstract saldoFiliais(produtoId?: number, empresaId?: number): Promise<SaldoFilial>;
  abstract saldoProdutoNaFilial(produtoId: number, empresaId: number): Promise<number>;

  // Dashboard
  abstract dashboard(): Promise<{
    resumo: { totalProdutos: number; produtosAtivos: number; produtosAbaixoMinimo: number };
    movimentacaoMes: { entradasQuantidade: number; saidasQuantidade: number; totalEntradasUnidades: number; totalSaidasUnidades: number; saldoLiquidoUnidades: number };
    produtosCriticos: products[];
  }>;
}
