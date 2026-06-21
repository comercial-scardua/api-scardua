import type { permission } from '@prisma/client'

export type PermissaoPagina = {
  canAccess: boolean
  canEdit: boolean
  canDelete: boolean
}

export type PermissoesUsuario = {
  permissions: Record<string, PermissaoPagina>
  restritoDepartamentos: string[]
  relatoriosRestritoDepartamentos: string[]
}

export interface DefinirPermissoesData {
  permissions: Record<
    string,
    { canAccess: boolean; canEdit: boolean; canDelete: boolean }
  >
  restritoDepartamentos?: string[]
  relatoriosRestritoDepartamentos?: string[]
}

export interface DefinirPermissaoPaginaData {
  canAccess: boolean
  canEdit: boolean
  canDelete: boolean
}

export abstract class PermissoesRepository {
  abstract findByUserId(userId: string): Promise<PermissoesUsuario>
  abstract findOne(userId: string, page: string): Promise<permission | null>
  abstract upsertBatch(
    userId: string,
    data: DefinirPermissoesData,
  ): Promise<PermissoesUsuario | null>
  abstract upsertPagina(
    userId: string,
    page: string,
    data: DefinirPermissaoPaginaData,
  ): Promise<permission | null>
  abstract remover(userId: string, page: string): Promise<boolean>
}
