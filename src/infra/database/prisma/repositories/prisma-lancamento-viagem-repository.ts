import { Injectable } from '@nestjs/common'
import type {
  CreateLancamentoViagemBulkData,
  FindAllViagemFilters,
  LancamentoViagemItem,
  LancamentoViagemRepository,
} from '../../../../domain/lancamento-viagem/application/repositories/lancamento-viagem-repository'
import { PrismaService } from '../../../../prisma/prisma.service'

const INCLUDE_CAIXA = {
  caixaViagem: {
    select: { id: true, destino: true, data: true, funcionarioId: true },
  },
} as const

@Injectable()
export class PrismaLancamentoViagemRepository
  implements LancamentoViagemRepository
{
  constructor(private prisma: PrismaService) {}

  findAll(filters: FindAllViagemFilters) {
    const where: Record<string, unknown> = {}

    if (filters.caixaId !== undefined) {
      where.caixaViagemId = filters.caixaId
    }

    if (filters.userId !== undefined) {
      where.caixaViagem = { userId: filters.userId }
    }

    return this.prisma.viagemlancamento.findMany({
      where,
      include: INCLUDE_CAIXA,
      orderBy: { data: 'desc' },
    })
  }

  async createBulk(data: CreateLancamentoViagemBulkData) {
    if (data.clearExisting && data.caixaViagemId) {
      await this.prisma.viagemlancamento.deleteMany({
        where: { caixaViagemId: data.caixaViagemId },
      })
    }

    const items: LancamentoViagemItem[] = data.lancamentos?.length
      ? data.lancamentos
      : data.data && data.custo && data.clienteFornecedor
        ? [
            {
              data: data.data,
              custo: data.custo,
              clienteFornecedor: data.clienteFornecedor,
              entrada: data.entrada,
              saida: data.saida,
              numeroDocumento: data.numeroDocumento,
              historicoDoc: data.historicoDoc,
            },
          ]
        : []

    const lancamentos = await Promise.all(
      items.map((item) =>
        this.prisma.viagemlancamento.create({
          data: {
            caixaViagemId: data.caixaViagemId ?? null,
            data: new Date(item.data),
            custo: item.custo,
            clienteFornecedor: item.clienteFornecedor,
            entrada: item.entrada ?? null,
            saida: item.saida ?? null,
            numeroDocumento: item.numeroDocumento ?? null,
            historicoDoc: item.historicoDoc ?? null,
            updatedAt: new Date(),
          },
        }),
      ),
    )

    return { count: lancamentos.length, lancamentos }
  }

  async findByColaboradorId(colaboradorId: number) {
    const caixas = await this.prisma.caixaviagem.findMany({
      where: { funcionarioId: colaboradorId },
      select: { id: true },
    })

    if (caixas.length === 0) return []

    return this.prisma.viagemlancamento.findMany({
      where: { caixaViagemId: { in: caixas.map((c) => c.id) } },
      include: INCLUDE_CAIXA,
      orderBy: { data: 'desc' },
    })
  }

  findCaixaAtivaByColaboradorId(colaboradorId: number) {
    return this.prisma.caixaviagem.findFirst({
      where: { funcionarioId: colaboradorId, oculto: false },
      orderBy: { data: 'desc' },
      select: { id: true },
    })
  }
}
