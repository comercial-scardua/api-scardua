export interface MonitorRegistroFilters {
  colaboradorId?: number
  dataInicio?: string
  dataFim?: string
  tipo?: string
  page?: number
  limit?: number
}

export interface MonitorRegistroResult {
  data: unknown[]
  pagination: { page: number; limit: number; total: number; totalPages: number }
  estatisticas: {
    total: number
    tipos: { tipo: string; count: number }[]
  }
}

export interface UpsertMonitorRegistroData {
  colaboradorId: number
  tipo: string
  data: string
  horaEntrada?: string
  horaSaida?: string
  observacao?: string
}

export abstract class MonitorRegistrosRepository {
  abstract findAll(
    filters: MonitorRegistroFilters,
  ): Promise<MonitorRegistroResult>
  abstract upsert(data: UpsertMonitorRegistroData): Promise<unknown>
}
