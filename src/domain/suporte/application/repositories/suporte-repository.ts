export interface CriarTicketSuporteData {
  ticketId: string
  tipoEvento: string
  descricao: string
  autorNome?: string
  autorEmail?: string
}

export abstract class SuporteRepository {
  abstract findAllTickets(): Promise<any[]>
  abstract findTicketById(ticketId: string): Promise<any[]>
  abstract findComentariosByTicketId(ticketId: string): Promise<any[]>
  abstract findUltimosEventos(): Promise<any[]>
  abstract createTicketEvento(data: CriarTicketSuporteData): Promise<any>
  abstract createComentario(
    ticketId: string,
    data: CriarTicketSuporteData,
  ): Promise<any>
  abstract updateTicket(
    ticketId: string,
    data: Record<string, unknown>,
  ): Promise<any>
  abstract deleteTicket(ticketId: string): Promise<void>
}
