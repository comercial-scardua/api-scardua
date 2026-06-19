import { Injectable } from '@nestjs/common'
import type { UpdateUsuarioInput } from '../../../../domain/usuarios/application/dtos/usuario-schema'
import {
  type CreateUsuarioData,
  type SafeUser,
  type UpsertPermissionData,
  type UsuariosRepository,
} from '../../../../domain/usuarios/application/repositories/usuarios-repository'
import { PrismaService } from '../../../../prisma/prisma.service'

const SELECT_SAFE: Record<keyof SafeUser, true> = {
  id: true,
  nome: true,
  sobrenome: true,
  email: true,
  cpf: true,
  role: true,
  setor: true,
  ramal: true,
  isTecnico: true,
  foto: true,
  especialidades: true,
  oculto: true,
  createdAt: true,
  updatedAt: true,
}

function formatCpf(cpf: string): string {
  const n = cpf.replace(/\D/g, '')
  return `${n.slice(0, 3)}.${n.slice(3, 6)}.${n.slice(6, 9)}-${n.slice(9)}`
}

@Injectable()
export class PrismaUsuariosRepository implements UsuariosRepository {
  constructor(private prisma: PrismaService) {}

  findAll({
    setor,
    role,
    oculto = false,
  }: {
    setor?: string
    role?: string
    oculto?: boolean
  } = {}) {
    return this.prisma.users.findMany({
      where: {
        oculto,
        ...(setor && { setor }),
        ...(role && { role: role as 'USER' | 'ADMIN' }),
      },
      select: SELECT_SAFE,
      orderBy: { nome: 'asc' },
    })
  }

  findById(id: string) {
    return this.prisma.users.findUnique({ where: { id }, select: SELECT_SAFE })
  }

  findByEmail(email: string) {
    return this.prisma.users.findUnique({
      where: { email },
      select: SELECT_SAFE,
    })
  }

  findByCpf(cpf: string) {
    return this.prisma.users.findUnique({
      where: { cpf: formatCpf(cpf) },
      select: SELECT_SAFE,
    })
  }

  async create({
    password: _,
    passwordHash,
    id,
    cpf,
    role,
    ...rest
  }: CreateUsuarioData): Promise<SafeUser> {
    const user = await this.prisma.users.create({
      data: {
        id,
        ...rest,
        cpf: formatCpf(cpf),
        password: passwordHash,
        role: (role as 'USER' | 'ADMIN') ?? 'USER',
        updatedAt: new Date(),
      },
      select: SELECT_SAFE,
    })

    // Vínculo automático: se existir colaborador com mesmo CPF, liga os dois.
    const normalizedCpf = cpf.replace(/\D/g, '')
    const colaborador = await this.prisma.colaboradores.findUnique({
      where: { cpf: normalizedCpf },
      select: { id: true, userId: true },
    })
    if (colaborador && !colaborador.userId) {
      await this.prisma.colaboradores.update({
        where: { id: colaborador.id },
        data: { userId: id, updatedAt: new Date() },
      })
    }

    return user
  }

  update(id: string, data: UpdateUsuarioInput) {
    return this.prisma.users.update({
      where: { id },
      data: { ...data, updatedAt: new Date() },
      select: SELECT_SAFE,
    })
  }

  softDelete(id: string) {
    return this.prisma.users.update({
      where: { id },
      data: { oculto: true, updatedAt: new Date() },
      select: SELECT_SAFE,
    })
  }

  async updateFoto(id: string, fotoUrl: string): Promise<void> {
    await this.prisma.users.update({
      where: { id },
      data: { foto: fotoUrl, updatedAt: new Date() },
    })
  }

  // ── Permissões ──────────────────────────────────────────────────────────

  findPermissions(userId?: string) {
    return this.prisma.permission.findMany({
      where: userId ? { userId } : {},
      orderBy: [{ userId: 'asc' }, { page: 'asc' }],
    })
  }

  findPermission(userId: string, page: string) {
    return this.prisma.permission.findUnique({
      where: { userId_page: { userId, page } },
    })
  }

  upsertPermission(userId: string, page: string, data: UpsertPermissionData) {
    return this.prisma.permission.upsert({
      where: { userId_page: { userId, page } },
      update: data,
      create: {
        userId,
        page,
        canAccess: data.canAccess ?? false,
        canEdit: data.canEdit ?? false,
        canDelete: data.canDelete ?? false,
      },
    })
  }
}
