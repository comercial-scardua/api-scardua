import { Injectable } from '@nestjs/common'
import {
  type CriarGestorEmpresaData,
  type FindAllGestorEmpresasFilters,
  type GestorEmpresasRepository,
} from '../../../../domain/gestor-empresas/application/repositories/gestor-empresas-repository'
import { PrismaService } from '../../../../prisma/prisma.service'

const INCLUDE_COMPLETO = {
  colaborador: {
    select: { id: true, nome: true, sobrenome: true, email: true },
  },
  empresa: {
    select: { id: true, nomeEmpresa: true, cnpj: true },
  },
} as const

@Injectable()
export class PrismaGestorEmpresasRepository
  implements GestorEmpresasRepository
{
  constructor(private prisma: PrismaService) {}

  findAll(filters: FindAllGestorEmpresasFilters) {
    const where: Record<string, unknown> = {}

    if (filters.empresaId !== undefined) {
      where.empresaId = filters.empresaId
    }

    if (filters.colaboradorId !== undefined) {
      where.colaboradorId = filters.colaboradorId
    }

    return this.prisma.gestor_empresas.findMany({
      where,
      include: INCLUDE_COMPLETO,
      orderBy: { id: 'asc' },
    })
  }

  upsert(data: CriarGestorEmpresaData) {
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
