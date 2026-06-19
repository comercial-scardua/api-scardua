import type { permission } from '@prisma/client'
import type {
  CreateUsuarioInput,
  UpdateUsuarioInput,
} from '../dtos/usuario-schema'

export type SafeUser = {
  id: string
  nome: string
  sobrenome: string
  email: string
  cpf: string
  role: string
  setor: string | null
  ramal: string | null
  isTecnico: boolean
  foto: string | null
  especialidades: string | null
  oculto: boolean
  createdAt: Date
  updatedAt: Date
}

export type CreateUsuarioData = CreateUsuarioInput & {
  id: string
  passwordHash: string
}

export interface UpsertPermissionData {
  canAccess?: boolean
  canEdit?: boolean
  canDelete?: boolean
}

export abstract class UsuariosRepository {
  abstract findAll(filters?: {
    setor?: string
    role?: string
    oculto?: boolean
  }): Promise<SafeUser[]>
  abstract findById(id: string): Promise<SafeUser | null>
  abstract findByEmail(email: string): Promise<SafeUser | null>
  abstract findByCpf(cpf: string): Promise<SafeUser | null>
  abstract create(data: CreateUsuarioData): Promise<SafeUser>
  abstract update(id: string, data: UpdateUsuarioInput): Promise<SafeUser>
  abstract softDelete(id: string): Promise<SafeUser>
  abstract updateFoto(id: string, fotoUrl: string): Promise<void>

  // Permissões
  abstract findPermissions(userId?: string): Promise<permission[]>
  abstract findPermission(
    userId: string,
    page: string,
  ): Promise<permission | null>
  abstract upsertPermission(
    userId: string,
    page: string,
    data: UpsertPermissionData,
  ): Promise<permission>
}
