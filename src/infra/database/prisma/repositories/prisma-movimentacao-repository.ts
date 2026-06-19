import { Injectable } from '@nestjs/common'
import {
  type CreateMovimentacaoData,
  type MovimentacaoFiltros,
  type MovimentacaoRepository,
} from '../../../../domain/movimentacao/application/repositories/movimentacao-repository'
import { PrismaService } from '../../../../prisma/prisma.service'

const INCLUDE_RELACOES = {
  patrimonio: { select: { id: true, nome: true, tipo: true } },
  autor: { select: { id: true, nome: true } },
  responsavelAnterior: { select: { id: true, nome: true } },
  responsavelNovo: { select: { id: true, nome: true } },
} as const

@Injectable()
export class PrismaMovimentacaoRepository implements MovimentacaoRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filtros: MovimentacaoFiltros) {
    const {
      patrimonioId,
      tipo,
      dataInicio,
      dataFim,
      page = 1,
      limit = 20,
    } = filtros

    const skip = (Number(page) - 1) * Number(limit)
    const where: Record<string, unknown> = {}

    if (patrimonioId) where.patrimonioId = Number(patrimonioId)
    if (tipo) where.tipo = tipo

    if (dataInicio || dataFim) {
      const dateFilter: Record<string, unknown> = {}
      if (dataInicio) dateFilter.gte = new Date(dataInicio)
      if (dataFim) dateFilter.lte = new Date(dataFim)
      where.createdAt = dateFilter
    }

    const [data, total] = await Promise.all([
      this.prisma.movimentacoes.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
        include: INCLUDE_RELACOES,
      }),
      this.prisma.movimentacoes.count({ where }),
    ])

    return {
      data,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    }
  }

  create(data: CreateMovimentacaoData, autorId?: number) {
    return this.criarComDadosAnteriores(data, autorId)
  }

  private async criarComDadosAnteriores(
    dto: CreateMovimentacaoData,
    autorId?: number,
  ) {
    const patrimonio = await this.prisma.patrimonios.findUnique({
      where: { id: dto.patrimonioId },
      select: { localizacao: true, responsavelId: true, kmEntrega: true },
    })

    return this.prisma.movimentacoes.create({
      data: {
        patrimonioId: dto.patrimonioId,
        tipo: dto.tipo,
        localizacaoAnterior: patrimonio?.localizacao ?? null,
        responsavelAnteriorId: patrimonio?.responsavelId ?? null,
        kmAnterior: patrimonio?.kmEntrega ?? null,
        localizacaoNova: dto.localizacaoNova ?? null,
        responsavelNovoId: dto.responsavelNovoId ?? null,
        kmNovo: dto.kmNovo ?? null,
        autorId: autorId ?? null,
        updatedAt: new Date(),
      },
      include: INCLUDE_RELACOES,
    })
  }
}
