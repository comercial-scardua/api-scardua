import type { Evento } from '../../../domain/eventos/enterprise/entities/evento'

/**
 * Converte a entidade de domínio Evento no formato de resposta HTTP.
 */
export class EventoPresenter {
  static toHTTP(evento: Evento) {
    return {
      id: Number(evento.id.toString()),
      tipo: evento.tipo,
      titulo: evento.titulo,
      descricao: evento.descricao,
      dataInicio: evento.dataInicio,
      dataFim: evento.dataFim,
      empresaId: evento.empresaId,
      responsavelId: evento.responsavelId,
      cor: evento.cor,
      criadoPorId: evento.criadoPorId,
      oculto: evento.oculto,
      createdAt: evento.createdAt,
      updatedAt: evento.updatedAt,
    }
  }
}
