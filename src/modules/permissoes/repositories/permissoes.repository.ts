import type { permission } from '@prisma/client'
import type { DefinirPermissaoPaginaDto } from '../dto/definir-permissao-pagina.dto'
import type { DefinirPermissoesDto } from '../dto/definir-permissoes.dto'

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

export abstract class PermissoesRepository {
  abstract findByUserId(userId: string): Promise<PermissoesUsuario>
  abstract findOne(userId: string, page: string): Promise<permission | null>
  abstract upsertBatch(
    userId: string,
    dto: DefinirPermissoesDto,
  ): Promise<PermissoesUsuario | null>
  abstract upsertPagina(
    userId: string,
    page: string,
    data: DefinirPermissaoPaginaDto,
  ): Promise<permission | null>
  abstract remover(userId: string, page: string): Promise<boolean>
}
