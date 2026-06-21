import { Injectable } from '@nestjs/common'
import type {
  MonitorRegistroFilters,
  MonitorRegistroResult,
  MonitorRegistrosRepository,
  UpsertMonitorRegistroData,
} from '../../../../domain/monitor-registros/application/repositories/monitor-registros-repository'
import { PrismaService } from '../../../../prisma/prisma.service'

@Injectable()
export class PrismaMonitorRegistrosRepository
  implements MonitorRegistrosRepository
{
  constructor(private prisma: PrismaService) {}

  async findAll(
    filters: MonitorRegistroFilters,
  ): Promise<MonitorRegistroResult> {
    const pageNum = filters.page ?? 1
    const limitNum = filters.limit ?? 50
    const skip = (pageNum - 1) * limitNum

    const where: Record<string, unknown> = {}

    if (filters.colaboradorId) {
      where.colaborador_id = filters.colaboradorId
    }

    if (filters.tipo) {
      where.tipo = filters.tipo
    }

    if (filters.dataInicio || filters.dataFim) {
      const dataFilter: Record<string, Date> = {}
      if (filters.dataInicio) dataFilter.gte = new Date(filters.dataInicio)
      if (filters.dataFim) dataFilter.lte = new Date(filters.dataFim)
      where.data = dataFilter
    }

    const [registros, total] = await Promise.all([
      this.prisma.registros_banco_horas.findMany({
        where,
        include: {
          colaborador: {
            select: { id: true, nome: true, sobrenome: true, setor: true },
          },
        },
        orderBy: { data: 'desc' },
        skip,
        take: limitNum,
      }),
      this.prisma.registros_banco_horas.count({ where }),
    ])

    const tipoStats = await this.prisma.registros_banco_horas.groupBy({
      by: ['tipo'],
      where,
      _count: { id: true },
    })

    return {
      data: registros,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
      estatisticas: {
        total,
        tipos: tipoStats.map((t) => ({ tipo: t.tipo, count: t._count.id })),
      },
    }
  }

  async upsert(data: UpsertMonitorRegistroData): Promise<unknown> {
    const colaborador = await this.prisma.colaboradores.findUnique({
      where: { id: data.colaboradorId },
      select: { id: true, nome: true, sobrenome: true },
    })

    const funcionarioNome = colaborador
      ? `${colaborador.nome ?? ''} ${colaborador.sobrenome ?? ''}`.trim()
      : `Colaborador #${data.colaboradorId}`

    const dataRegistro = new Date(data.data)

    const existing = await this.prisma.registros_banco_horas.findFirst({
      where: {
        colaborador_id: data.colaboradorId,
        tipo: data.tipo,
        data: dataRegistro,
      },
    })

    if (existing) {
      return this.prisma.registros_banco_horas.update({
        where: { id: existing.id },
        data: {
          hora_inicio: data.horaEntrada ?? existing.hora_inicio,
          hora_fim: data.horaSaida ?? existing.hora_fim,
          observacao: data.observacao ?? existing.observacao,
          data_modificado: new Date(),
        },
      })
    }

    return this.prisma.registros_banco_horas.create({
      data: {
        colaborador_id: data.colaboradorId,
        funcionario_nome: funcionarioNome,
        tipo: data.tipo,
        data: dataRegistro,
        hora_inicio: data.horaEntrada ?? null,
        hora_fim: data.horaSaida ?? null,
        observacao: data.observacao ?? null,
        data_modificado: new Date(),
      },
    })
  }
}
