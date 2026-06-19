import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../../prisma/prisma.service'
import type { CriarGestorEmpresaDto } from '../dto/criar-gestor-empresa.dto'

const INCLUDE_COMPLETO = {
  colaborador: {
    select: { id: true, nome: true, sobrenome: true, email: true },
  },
  empresa: {
    select: { id: true, nomeEmpresa: true, cnpj: true },
  },
} as const

@Injectable()
export class GestorEmpresasRepository {
  constructor(private prisma: PrismaService) {}

  findAll(filters: { empresaId?: number; colaboradorId?: number }) {
    const where: Record<string, unknown> = {}

    if (filters.empresaId !== undefined) {
      where['empresaId'] = filters.empresaId
    }

    if (filters.colaboradorId !== undefined) {
      where['colaboradorId'] = filters.colaboradorId
    }

    return this.prisma.gestor_empresas.findMany({
      where,
      include: INCLUDE_COMPLETO,
      orderBy: { id: 'asc' },
    })
  }

  upsert(data: CriarGestorEmpresaDto) {
    return this.prisma.gestor_empresas.upsert({
      where: {
        colaboradorId_empresaId: {
          colaboradorId: data.colaboradorId,
          empresaId: data.empresaId,
        },
      },
      update: {},
      create: {
        colaboradorId: data.colaboradorId,
        empresaId: data.empresaId,
      },
      include: INCLUDE_COMPLETO,
    })
  }
}
