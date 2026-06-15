import { Injectable } from '@nestjs/common'
import { historico_tickets_tipoEvento } from '@prisma/client'
import { randomUUID } from 'crypto'
import { PrismaService } from '../../../prisma/prisma.service'
import type { CriarTicketSuporteDto } from '../dto/criar-ticket-suporte.dto'

@Injectable()
export class SuporteRepository {
  constructor(private prisma: PrismaService) {}

  // ── Listar tickets agrupados por ticketId ─────────────────────────────────

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

  // ── Buscar ticket por ID (todos os eventos) ───────────────────────────────

  async findTicketById(ticketId: string) {
    return this.prisma.historico_tickets.findMany({
      where: { ticketId },
      orderBy: { dataCriacao: 'asc' },
    })
  }

  // ── Comentários de um ticket (eventos COMENTARIO_PUBLICO) ─────────────────

  async findComentariosByTicketId(ticketId: string) {
    return this.prisma.historico_tickets.findMany({
      where: {
        ticketId,
        tipoEvento: historico_tickets_tipoEvento.COMENTARIO_PUBLICO,
      },
      orderBy: { dataCriacao: 'asc' },
    })
  }

  // ── Últimos 20 eventos de todos os tickets ────────────────────────────────

  async findUltimosEventos() {
    return this.prisma.historico_tickets.findMany({
      orderBy: { dataCriacao: 'desc' },
      take: 20,
    })
  }

  // ── Criar evento de ticket ────────────────────────────────────────────────

  async createTicketEvento(data: CriarTicketSuporteDto) {
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
}
