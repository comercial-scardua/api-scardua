import { Injectable } from '@nestjs/common'
import {
  type EventosRepository,
  type FindManyEventosFilters,
} from '../../../../domain/eventos/application/repositories/eventos-repository'
import type { Evento } from '../../../../domain/eventos/enterprise/entities/evento'
import { PrismaService } from '../../../../prisma/prisma.service'
import { PrismaEventoMapper } from '../mappers/prisma-evento-mapper'

@Injectable()
export class PrismaEventosRepository implements EventosRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: number): Promise<Evento | null> {
    const evento = await this.prisma.eventos.findUnique({ where: { id } })
    return evento ? PrismaEventoMapper.toDomain(evento) : null
  }

  async findMany(filters: FindManyEventosFilters): Promise<Evento[]> {
    const where: Record<string, unknown> = {}

    if (filters.tipo) where.tipo = filters.tipo
    if (filters.empresaId !== undefined) where.empresaId = filters.empresaId
    where.oculto = filters.oculto !== undefined ? filters.oculto : false

    if (filters.mes !== undefined && filters.ano !== undefined) {
      where.dataInicio = {
        gte: new Date(filters.ano, filters.mes - 1, 1),
        lt: new Date(filters.ano, filters.mes, 1),
      }
    } else if (filters.ano !== undefined) {
      where.dataInicio = {
        gte: new Date(filters.ano, 0, 1),
        lt: new Date(filters.ano + 1, 0, 1),
      }
    }

    const eventos = await this.prisma.eventos.findMany({
      where,
      orderBy: { dataInicio: 'asc' },
    })

    return eventos.map(PrismaEventoMapper.toDomain)
  }

  async create(evento: Evento): Promise<Evento> {
    const created = await this.prisma.eventos.create({
      data: PrismaEventoMapper.toPrismaCreate(evento),
    })
    return PrismaEventoMapper.toDomain(created)
  }

  async save(evento: Evento): Promise<Evento> {
    const id = Number(evento.id.toString())
    const updated = await this.prisma.eventos.update({
      where: { id },
      data: PrismaEventoMapper.toPrismaUpdate(evento),
    })
    return PrismaEventoMapper.toDomain(updated)
  }
}
