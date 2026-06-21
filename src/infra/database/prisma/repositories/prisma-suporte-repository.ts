import { Injectable } from '@nestjs/common'
import { historico_tickets_tipoEvento } from '@prisma/client'
import { randomUUID } from 'crypto'
import type { CriarTicketSuporteData } from '../../../../domain/suporte/application/repositories/suporte-repository'
import { PrismaService } from '../../../../prisma/prisma.service'

@Injectable()
export class PrismaSuporteRepository {
  constructor(private prisma: PrismaService) {}

  async findAllTickets() {
    const grupos = await this.prisma.historico_tickets.groupBy({
      by: ['ticketId'],
      _count: { id: true },
      _max: { dataCriacao: true },
      orderBy: { _max: { dataCriacao: 'desc' } },
    })

    if (!grupos.length) return []

    const ticketIds = grupos.map((g) => g.ticketId)

    const ultimosEventos = await this.prisma.historico_tickets.findMany({
      where: { ticketId: { in: ticketIds } },
      orderBy: { dataCriacao: 'desc' },
    })

    const ultimoEventoPorTicket = new Map<string, (typeof ultimosEventos)[0]>()
    for (const evento of ultimosEventos) {
      if (!ultimoEventoPorTicket.has(evento.ticketId)) {
        ultimoEventoPorTicket.set(evento.ticketId, evento)
      }
    }

    return grupos.map((g) => ({
      ticketId: g.ticketId,
      totalEventos: g._count.id,
      ultimaAtividade: g._max.dataCriacao,
      ultimoEvento: ultimoEventoPorTicket.get(g.ticketId) ?? null,
    }))
  }

  async findTicketById(ticketId: string) {
    return this.prisma.historico_tickets.findMany({
      where: { ticketId },
      orderBy: { dataCriacao: 'asc' },
    })
  }

  async findComentariosByTicketId(ticketId: string) {
    return this.prisma.historico_tickets.findMany({
      where: {
        ticketId,
        tipoEvento: historico_tickets_tipoEvento.COMENTARIO_PUBLICO,
      },
      orderBy: { dataCriacao: 'asc' },
    })
  }

  async findUltimosEventos() {
    return this.prisma.historico_tickets.findMany({
      orderBy: { dataCriacao: 'desc' },
      take: 20,
    })
  }

  async createTicketEvento(data: CriarTicketSuporteData) {
    return this.prisma.historico_tickets.create({
      data: {
        id: randomUUID(),
        ticketId: data.ticketId,
        tipoEvento: data.tipoEvento as historico_tickets_tipoEvento,
        descricao: data.descricao,
        autorNome: data.autorNome,
        autorEmail: data.autorEmail,
        dataCriacao: new Date(),
        dataAtualizacao: new Date(),
      },
    })
  }

  async createComentario(ticketId: string, data: CriarTicketSuporteData) {
    return this.prisma.historico_tickets.create({
      data: {
        id: randomUUID(),
        ticketId,
        tipoEvento: historico_tickets_tipoEvento.COMENTARIO_PUBLICO,
        descricao: data.descricao,
        autorNome: data.autorNome,
        autorEmail: data.autorEmail,
        dataCriacao: new Date(),
        dataAtualizacao: new Date(),
      },
    })
  }

  async updateTicket(ticketId: string, data: Record<string, unknown>) {
    const ultimo = await this.prisma.historico_tickets.findFirst({
      where: { ticketId },
      orderBy: { dataCriacao: 'desc' },
    })
    if (!ultimo) return null

    return this.prisma.historico_tickets.update({
      where: { id: ultimo.id },
      data: {
        descricao: (data['descricao'] as string) ?? ultimo.descricao,
        dataAtualizacao: new Date(),
      },
    })
  }

  async deleteTicket(ticketId: string) {
    await this.prisma.historico_tickets.deleteMany({ where: { ticketId } })
  }
}
