import { Injectable } from '@nestjs/common'
import type {
  AtualizarTabelaPrecoData,
  HistoricoFilters,
  HistoricoResult,
  ImportarTabelaPrecoData,
  IncluirTabelaPrecoData,
  TabelaDePrecoRepository,
} from '../../../../domain/tabela-de-preco/application/repositories/tabela-de-preco-repository'
import { PrismaService } from '../../../../prisma/prisma.service'

const TIPOS_PRECO_BASE = ['tabela', 'importacao', 'atualizacao'] as string[]

@Injectable()
export class PrismaTabelaDePrecoRepository implements TabelaDePrecoRepository {
  constructor(private prisma: PrismaService) {}

  async incluir(
    data: IncluirTabelaPrecoData,
  ): Promise<{ total: number; registros: unknown[] }> {
    const registros = await Promise.all(
      data.itens.map((item) =>
        this.prisma.precificador_historico.create({
          data: {
            userId: data.userId,
            empresaId: data.empresaId,
            empresaNome: data.empresaNome,
            produtoCodigo: item.produtoCodigo,
            produtoNome: item.produtoNome,
            tipoPrecoBase: 'tabela',
            custoBase: item.precoBase ?? item.precoVenda,
            custosFixosPerc: 0,
            lucroPercDesejado: 0,
            precoFinal: item.precoVenda,
            lucroLiquido: 0,
            margemLiquida: 0,
          },
        }),
      ),
    )

    return { total: registros.length, registros }
  }

  async importar(
    data: ImportarTabelaPrecoData,
  ): Promise<{ total: number; registros: unknown[] }> {
    const registros = await Promise.all(
      data.itens.map((item) =>
        this.prisma.precificador_historico.create({
          data: {
            userId: data.userId,
            empresaId: data.empresaId,
            empresaNome: data.empresaNome,
            produtoCodigo: item.produtoCodigo,
            produtoNome: item.produtoNome,
            tipoPrecoBase: 'importacao',
            custoBase: item.precoBase ?? item.precoVenda,
            custosFixosPerc: 0,
            lucroPercDesejado: 0,
            precoFinal: item.precoVenda,
            lucroLiquido: 0,
            margemLiquida: 0,
          },
        }),
      ),
    )

    return { total: registros.length, registros }
  }

  async atualizar(
    data: AtualizarTabelaPrecoData,
  ): Promise<{ total: number; registros: unknown[] }> {
    const itens = data.itens ?? []

    const registros = await Promise.all(
      itens.map((item) =>
        this.prisma.precificador_historico.create({
          data: {
            userId: data.userId,
            empresaId: data.empresaId ?? 0,
            empresaNome: data.empresaNome ?? '',
            produtoCodigo: item.produtoCodigo,
            produtoNome: item.produtoNome,
            tipoPrecoBase: 'atualizacao',
            custoBase: item.precoBase ?? item.precoVenda,
            custosFixosPerc: 0,
            lucroPercDesejado: 0,
            precoFinal: item.precoVenda,
            lucroLiquido: 0,
            margemLiquida: 0,
          },
        }),
      ),
    )

    return { total: registros.length, registros }
  }

  async historico(filters: HistoricoFilters): Promise<HistoricoResult> {
    const pageNum = filters.page ?? 1
    const limitNum = filters.limit ?? 20
    const skip = (pageNum - 1) * limitNum

    const where = {
      tipoPrecoBase: { in: TIPOS_PRECO_BASE },
      ...(filters.empresaId ? { empresaId: filters.empresaId } : {}),
    }

    const [total, dados] = await Promise.all([
      this.prisma.precificador_historico.count({ where }),
      this.prisma.precificador_historico.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
      }),
    ])

    return {
      total,
      page: pageNum,
      limit: limitNum,
      pages: Math.ceil(total / limitNum),
      dados,
    }
  }

  async limparHistorico(
    ids?: number[],
  ): Promise<{ deletados: number; mensagem: string }> {
    if (ids && ids.length > 0) {
      const result = await this.prisma.precificador_historico.deleteMany({
        where: { id: { in: ids } },
      })
      return {
        deletados: result.count,
        mensagem: `${result.count} registro(s) removido(s)`,
      }
    }

    const result = await this.prisma.precificador_historico.deleteMany({
      where: { tipoPrecoBase: { in: TIPOS_PRECO_BASE } },
    })
    return {
      deletados: result.count,
      mensagem: `Histórico limpo: ${result.count} registro(s) removido(s)`,
    }
  }
}
