import type { relatorio_permissions, relatorios } from '@prisma/client'

export interface FindAllRelatoriosFilters {
  departamento?: string
  restrito?: boolean
  search?: string
}

export interface CreateRelatorioData {
  nome: string
  departamento: string
  descricao?: string | null
  query_sql: string
  restrito?: boolean
  usuario_id?: number | null
  usuario_nome?: string | null
  banco_dados?: string
  parametros?: string | null
  ativo?: boolean
}

export type UpdateRelatorioData = Partial<CreateRelatorioData>

export abstract class RelatoriosRepository {
  abstract findAll(filters: FindAllRelatoriosFilters): Promise<relatorios[]>
  abstract findById(id: number): Promise<relatorios | null>
  abstract create(data: CreateRelatorioData): Promise<relatorios>
  abstract update(id: number, data: UpdateRelatorioData): Promise<relatorios>
  abstract softDelete(id: number): Promise<relatorios>
  abstract getPermissions(relatorioId: number): Promise<relatorio_permissions[]>
  abstract setPermissions(
    relatorioId: number,
    userIds: string[],
  ): Promise<relatorio_permissions[]>
}
