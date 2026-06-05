import { Injectable } from '@nestjs/common';
import type { PrismaService } from '../../../prisma/prisma.service';
import type { CriarEntradaDto } from '../dto/criar-entrada.dto';
import type { CriarProdutoDto } from '../dto/criar-produto.dto';
import type { CriarSaidaDto } from '../dto/criar-saida.dto';
import type { CriarTransferenciaDto } from '../dto/criar-transferencia.dto';
import type { EstoqueRepository, FiltrosPagina, SaldoFilial } from './estoque.repository';

@Injectable()
export class PrismaEstoqueRepository implements EstoqueRepository {
  constructor(private prisma: PrismaService) {}

  // ── Produtos ──────────────────────────────────────────────────────────────

  async findProdutos({ search, categoria, status, page = 1, limit = 10 }: { search?: string; categoria?: string; status?: string } & FiltrosPagina) {
    const where = {
      ...(categoria && { categoria }),
      ...(status && { status: status as 'ATIVO' | 'INATIVO' }),
      ...(search && { OR: [{ codigoInterno: { contains: search } }, { nome: { contains: search } }] }),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.products.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { nome: 'asc' } }),
      this.prisma.products.count({ where }),
    ]);

    return { data, total, pages: Math.ceil(total / limit) };
  }

  findProdutoById(id: number) {
    return this.prisma.products.findUnique({ where: { id } });
  }

  findProdutoByCodigo(codigo: string) {
    return this.prisma.products.findUnique({ where: { codigoInterno: codigo } });
  }

  criarProduto(data: CriarProdutoDto, _userId: string) {
    return this.prisma.products.create({
      data: { ...data, estoqueAtual: 0 },
    });
  }

  atualizarProduto(id: number, data: Partial<CriarProdutoDto>) {
    return this.prisma.products.update({ where: { id }, data });
  }

  desativarProduto(id: number) {
    return this.prisma.products.update({ where: { id }, data: { status: 'INATIVO' } });
  }

  // ── Entradas ──────────────────────────────────────────────────────────────

  async findEntradas({ produtoId, numeroNotaFiscal, dataInicio, dataFim, page = 1, limit = 10 }: { produtoId?: number; numeroNotaFiscal?: string; dataInicio?: string; dataFim?: string } & FiltrosPagina) {
    const where = {
      ...(produtoId && { produtoId }),
      ...(numeroNotaFiscal && { numeroNotaFiscal: { contains: numeroNotaFiscal } }),
      ...(dataInicio && dataFim && {
        dataEntrada: {
          gte: new Date(dataInicio),
          lte: new Date(`${dataFim}T23:59:59`),
        },
      }),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.stock_entries.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { dataEntrada: 'desc' } }),
      this.prisma.stock_entries.count({ where }),
    ]);

    return { data, total, pages: Math.ceil(total / limit) };
  }

  async criarEntrada(data: CriarEntradaDto, userId: string, arquivoUrl?: string) {
    const [entrada] = await this.prisma.$transaction([
      this.prisma.stock_entries.create({
        data: {
          produtoId: data.produtoId,
          empresaId: data.empresaId ?? null,
          quantidade: data.quantidade,
          dataEntrada: new Date(data.dataEntrada),
          numeroNotaFiscal: data.numeroNotaFiscal,
          observacoes: data.observacoes,
          arquivoNotaFiscal: arquivoUrl,
          createdBy: userId,
        },
      }),
      this.prisma.products.update({
        where: { id: data.produtoId },
        data: { estoqueAtual: { increment: data.quantidade } },
      }),
    ]);
    return entrada;
  }

  // ── Saídas ────────────────────────────────────────────────────────────────

  async findSaidas({ produtoId, responsavel, motivo, dataInicio, dataFim, page = 1, limit = 10 }: { produtoId?: number; responsavel?: string; motivo?: string; dataInicio?: string; dataFim?: string } & FiltrosPagina) {
    const where = {
      ...(produtoId && { produtoId }),
      ...(responsavel && { responsavel: { contains: responsavel } }),
      ...(motivo && { motivo }),
      ...(dataInicio && dataFim && {
        dataSaida: {
          gte: new Date(dataInicio),
          lte: new Date(`${dataFim}T23:59:59`),
        },
      }),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.stock_exits.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { dataSaida: 'desc' } }),
      this.prisma.stock_exits.count({ where }),
    ]);

    return { data, total, pages: Math.ceil(total / limit) };
  }

  async criarSaida(data: CriarSaidaDto, userId: string) {
    const [saida] = await this.prisma.$transaction([
      this.prisma.stock_exits.create({
        data: {
          produtoId: data.produtoId,
          empresaId: data.empresaId ?? null,
          quantidade: data.quantidade,
          dataSaida: new Date(data.dataSaida),
          responsavel: data.responsavel,
          motivo: data.motivo,
          observacoes: data.observacoes,
          createdBy: userId,
        },
      }),
      this.prisma.products.update({
        where: { id: data.produtoId },
        data: { estoqueAtual: { decrement: data.quantidade } },
      }),
    ]);
    return saida;
  }

  // ── Transferências ────────────────────────────────────────────────────────

  async findTransferencias({ produtoId, empresaOrigemId, empresaDestinoId, dataInicio, dataFim, page = 1, limit = 10 }: { produtoId?: number; empresaOrigemId?: number; empresaDestinoId?: number; dataInicio?: string; dataFim?: string } & FiltrosPagina) {
    const where = {
      ...(produtoId && { produtoId }),
      ...(empresaOrigemId && { empresaOrigemId }),
      ...(empresaDestinoId && { empresaDestinoId }),
      ...(dataInicio && dataFim && {
        dataTransferencia: {
          gte: new Date(dataInicio),
          lte: new Date(`${dataFim}T23:59:59`),
        },
      }),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.stock_transfers.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { dataTransferencia: 'desc' } }),
      this.prisma.stock_transfers.count({ where }),
    ]);

    return { data, total, pages: Math.ceil(total / limit) };
  }

  async criarTransferencia(data: CriarTransferenciaDto, userId: string) {
    const [saida, entrada, transferencia] = await this.prisma.$transaction([
      this.prisma.stock_exits.create({
        data: {
          produtoId: data.produtoId,
          empresaId: data.empresaOrigemId,
          quantidade: data.quantidade,
          dataSaida: new Date(data.dataTransferencia),
          responsavel: data.responsavel,
          motivo: 'TRANSFERENCIA',
          observacoes: data.observacoes,
          createdBy: userId,
        },
      }),
      this.prisma.stock_entries.create({
        data: {
          produtoId: data.produtoId,
          empresaId: data.empresaDestinoId,
          quantidade: data.quantidade,
          dataEntrada: new Date(data.dataTransferencia),
          observacoes: data.observacoes,
          createdBy: userId,
        },
      }),
      this.prisma.stock_transfers.create({
        data: {
          produtoId: data.produtoId,
          empresaOrigemId: data.empresaOrigemId,
          empresaDestinoId: data.empresaDestinoId,
          quantidade: data.quantidade,
          dataTransferencia: new Date(data.dataTransferencia),
          responsavel: data.responsavel,
          observacoes: data.observacoes,
          createdBy: userId,
        },
      }),
    ]);

    // Atualiza os links da transferência após criar os registros
    await this.prisma.stock_transfers.update({
      where: { id: transferencia.id },
      data: { saidaId: saida.id, entradaId: entrada.id },
    });

    return transferencia;
  }

  // ── Saldos por filial (SQL raw — UNION entradas e saídas) ─────────────────

  async saldoFiliais(produtoId?: number, empresaId?: number): Promise<SaldoFilial> {
    const rows = await this.prisma.$queryRaw<
      { produtoId: number; empresaId: number; saldo: number }[]
    >`
      SELECT
        produtoId,
        empresaId,
        SUM(CASE WHEN tipo = 'entrada' THEN quantidade ELSE -quantidade END) AS saldo
      FROM (
        SELECT produtoId, empresaId, quantidade, 'entrada' AS tipo FROM stock_entries
          WHERE empresaId IS NOT NULL
          ${produtoId ? this.prisma.$queryRaw`AND produtoId = ${produtoId}` : this.prisma.$queryRaw``}
          ${empresaId ? this.prisma.$queryRaw`AND empresaId = ${empresaId}` : this.prisma.$queryRaw``}
        UNION ALL
        SELECT produtoId, empresaId, quantidade, 'saida' AS tipo FROM stock_exits
          WHERE empresaId IS NOT NULL
          ${produtoId ? this.prisma.$queryRaw`AND produtoId = ${produtoId}` : this.prisma.$queryRaw``}
          ${empresaId ? this.prisma.$queryRaw`AND empresaId = ${empresaId}` : this.prisma.$queryRaw``}
      ) AS movimentos
      GROUP BY produtoId, empresaId
    `;

    const result: SaldoFilial = {};
    for (const row of rows) {
      if (!result[row.produtoId]) result[row.produtoId] = {};
      result[row.produtoId][row.empresaId] = Number(row.saldo);
    }
    return result;
  }

  async saldoProdutoNaFilial(produtoId: number, empresaId: number): Promise<number> {
    const rows = await this.prisma.$queryRaw<{ saldo: number }[]>`
      SELECT
        SUM(CASE WHEN tipo = 'entrada' THEN quantidade ELSE -quantidade END) AS saldo
      FROM (
        SELECT quantidade, 'entrada' AS tipo FROM stock_entries
          WHERE produtoId = ${produtoId} AND empresaId = ${empresaId}
        UNION ALL
        SELECT quantidade, 'saida' AS tipo FROM stock_exits
          WHERE produtoId = ${produtoId} AND empresaId = ${empresaId}
      ) AS movimentos
    `;
    return Number(rows[0]?.saldo ?? 0);
  }

  // ── Dashboard ─────────────────────────────────────────────────────────────

  async dashboard() {
    const inicioMes = new Date();
    inicioMes.setDate(1);
    inicioMes.setHours(0, 0, 0, 0);

    const [
      totalProdutos,
      produtosAtivos,
      todos,
      entradasMes,
      saidasMes,
      totalEntradasUnidades,
      totalSaidasUnidades,
      produtosCriticos,
    ] = await Promise.all([
      this.prisma.products.count(),
      this.prisma.products.count({ where: { status: 'ATIVO' } }),
      this.prisma.products.findMany({ where: { status: 'ATIVO' }, select: { estoqueAtual: true, estoqueMinimo: true } }),
      this.prisma.stock_entries.count({ where: { dataEntrada: { gte: inicioMes } } }),
      this.prisma.stock_exits.count({ where: { dataSaida: { gte: inicioMes } } }),
      this.prisma.stock_entries.aggregate({ where: { dataEntrada: { gte: inicioMes } }, _sum: { quantidade: true } }),
      this.prisma.stock_exits.aggregate({ where: { dataSaida: { gte: inicioMes } }, _sum: { quantidade: true } }),
      this.prisma.products.findMany({
        where: { status: 'ATIVO' },
        orderBy: { estoqueAtual: 'asc' },
        take: 10,
      }),
    ]);

    const produtosAbaixoMinimo = todos.filter((p) => p.estoqueAtual < p.estoqueMinimo).length;
    const entUnid = totalEntradasUnidades._sum.quantidade ?? 0;
    const saiUnid = totalSaidasUnidades._sum.quantidade ?? 0;

    return {
      resumo: { totalProdutos, produtosAtivos, produtosAbaixoMinimo },
      movimentacaoMes: {
        entradasQuantidade: entradasMes,
        saidasQuantidade: saidasMes,
        totalEntradasUnidades: entUnid,
        totalSaidasUnidades: saiUnid,
        saldoLiquidoUnidades: entUnid - saiUnid,
      },
      produtosCriticos: produtosCriticos.filter((p) => p.estoqueAtual < p.estoqueMinimo),
    };
  }
}
