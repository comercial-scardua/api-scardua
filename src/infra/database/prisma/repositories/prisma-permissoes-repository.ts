import { Injectable } from '@nestjs/common'
import type { permission } from '@prisma/client'
import type {
  DefinirPermissaoPaginaData,
  DefinirPermissoesData,
  PermissaoPagina,
  PermissoesUsuario,
} from '../../../../domain/permissoes/application/repositories/permissoes-repository'
import { PermissoesRepository } from '../../../../domain/permissoes/application/repositories/permissoes-repository'
import { PAGINAS } from '../../../../domain/permissoes/application/paginas.constant'
import { PrismaService } from '../../../../prisma/prisma.service'

@Injectable()
export class PrismaPermissoesRepository implements PermissoesRepository {
  constructor(private prisma: PrismaService) {}

  async findByUserId(userId: string): Promise<PermissoesUsuario> {
    const [permissoes, user] = await Promise.all([
      this.prisma.permission.findMany({
        where: { userId },
        orderBy: { page: 'asc' },
      }),
      this.prisma.users.findUnique({
        where: { id: userId },
        select: { permissions_json: true },
      }),
    ])

    // Monta objeto base a partir da tabela permission
    const permissions: Record<string, PermissaoPagina> = {}
    for (const perm of permissoes) {
      permissions[perm.page] = {
        canAccess: perm.canAccess,
        canEdit: perm.canEdit,
        canDelete: perm.canDelete,
      }
    }

    const result: PermissoesUsuario = {
      permissions,
      restritoDepartamentos: [],
      relatoriosRestritoDepartamentos: [],
    }

    // Mescla permissions_json — sub-permissões e campos especiais
    if (user?.permissions_json) {
      try {
        const json = JSON.parse(user.permissions_json) as Record<
          string,
          unknown
        >

        for (const [key, value] of Object.entries(json)) {
          if (
            key === 'restritoDepartamentos' ||
            key === 'relatoriosRestritoDepartamentos'
          ) {
            result[key] = value as string[]
          } else if (typeof value === 'object' && value !== null) {
            result.permissions[key] = {
              ...result.permissions[key],
              ...(value as PermissaoPagina),
            }
          }
        }
      } catch {
        // permissions_json inválido — ignora silenciosamente
      }
    }

    return result
  }

  findOne(userId: string, page: string) {
    return this.prisma.permission.findUnique({
      where: { userId_page: { userId, page } },
    })
  }

  async upsertBatch(
    userId: string,
    data: DefinirPermissoesData,
  ): Promise<PermissoesUsuario | null> {
    const user = await this.prisma.users.findUnique({
      where: { id: userId },
      select: { id: true },
    })
    if (!user) return null

    // Upsert de cada página na tabela permission
    await this.prisma.$transaction(
      PAGINAS.map((page) => {
        const perm = data.permissions[page] ?? {
          canAccess: false,
          canEdit: false,
          canDelete: false,
        }
        return this.prisma.permission.upsert({
          where: { userId_page: { userId, page } },
          create: { userId, page, ...perm },
          update: perm,
        })
      }),
    )

    // Monta objeto completo para salvar no permissions_json
    const completePermissions: Record<string, unknown> = {}
    for (const page of PAGINAS) {
      completePermissions[page] = data.permissions[page] ?? {
        canAccess: false,
        canEdit: false,
        canDelete: false,
      }
    }
    completePermissions.restritoDepartamentos =
      data.restritoDepartamentos ?? []
    completePermissions.relatoriosRestritoDepartamentos =
      data.relatoriosRestritoDepartamentos ?? []

    await this.prisma.users.update({
      where: { id: userId },
      data: {
        permissions_json: JSON.stringify(completePermissions),
        updatedAt: new Date(),
      },
    })

    return this.findByUserId(userId)
  }

  async upsertPagina(
    userId: string,
    page: string,
    data: DefinirPermissaoPaginaData,
  ): Promise<permission | null> {
    const user = await this.prisma.users.findUnique({
      where: { id: userId },
      select: { id: true },
    })
    if (!user) return null

    return this.prisma.permission.upsert({
      where: { userId_page: { userId, page } },
      create: { userId, page, ...data },
      update: data,
    })
  }

  async remover(userId: string, page: string): Promise<boolean> {
    const existe = await this.findOne(userId, page)
    if (!existe) return false

    await this.prisma.permission.delete({
      where: { userId_page: { userId, page } },
    })
    return true
  }
}
