import type { Evento } from '../../enterprise/entities/evento'

export interface FindManyEventosFilters {
  mes?: number
  ano?: number
  tipo?: string
  empresaId?: number
  oculto?: boolean
}

/**
 * Contrato do repositório de eventos. Implementado por classes na camada de
 * infra (ex.: Prisma). É uma classe abstrata para servir como token de DI no Nest.
 */
export abstract class EventosRepository {
  abstract findById(id: number): Promise<Evento | null>
  abstract findMany(filters: FindManyEventosFilters): Promise<Evento[]>
  abstract create(evento: Evento): Promise<Evento>
  abstract save(evento: Evento): Promise<Evento>
}
