import { Injectable } from '@nestjs/common'
import type {
  NcmDiagnostico,
  NcmIntegridade,
  NcmListFilters,
  NcmListResult,
  NcmSearchFilters,
  NcmUtilitiesRepository,
  PecasSemNcmResult,
} from '../../../../domain/ncm-utilities/application/repositories/ncm-utilities-repository'
import { PrismaService } from '../../../../prisma/prisma.service'

@Injectable()
export class PrismaNcmUtilitiesRepository implements NcmUtilitiesRepository {
  constructor(private prisma: PrismaService) {}

  async listNcms(filters: NcmListFilters): Promise<NcmListResult> {
    const pageNum = Math.max(
      1,
      Number.parseInt(String(filters.page ?? 1), 10) || 1,
    )
    const limitNum = Math.min(
      500,
      Math.max(1, Number.parseInt(String(filters.limit ?? 100), 10) || 100),
    )
    const skip = (pageNum - 1) * limitNum

    const [total, data] = await Promise.all([
      this.prisma.ncm.count(),
      this.prisma.ncm.findMany({
        skip,
        take: limitNum,
        orderBy: { id: 'asc' },
      }),
    ])

    return {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
      data,
    }
  }

  async searchNcm(
    filters: NcmSearchFilters,
  ): Promise<{ total: number; data: unknown[] }> {
    const where: Record<string, unknown> = {}

    if (filters.codigo) {
      where.codigo_ncm = { contains: filters.codigo }
    }

    if (filters.descricao) {
      where.categoria_cliente = { contains: filters.descricao }
    }

    if (filters.q && !filters.codigo && !filters.descricao) {
      where.OR = [
        { codigo_ncm: { contains: filters.q } },
        { categoria_cliente: { contains: filters.q } },
        { empresa: { contains: filters.q } },
      ]
    }

    const data = await this.prisma.ncm.findMany({
      where,
      take: 200,
      orderBy: { codigo_ncm: 'asc' },
    })

    return { total: data.length, data }
  }

  async diagnoseNcmLimit(): Promise<NcmDiagnostico> {
    const total = await this.prisma.ncm.count()
    const ativos = await this.prisma.ncm.count({ where: { ativo: true } })
    const inativos = total - ativos
    return { total, ativos, inativos }
  }

  async finalNcmValidation(): Promise<NcmIntegridade> {
    const total = await this.prisma.ncm.count()
    const semCodigoNcm = await this.prisma.ncm.count({
      where: { codigo_ncm: '' },
    })
    const semEmpresa = await this.prisma.ncm.count({
      where: { empresa: '' },
    })
    const semUfEmissor = await this.prisma.ncm.count({
      where: { uf_emissor: '' },
    })
    const semUfDestino = await this.prisma.ncm.count({
      where: { uf_destino: '' },
    })

    return {
      total,
      integridade: {
        semCodigoNcm,
        semEmpresa,
        semUfEmissor,
        semUfDestino,
      },
      valido: semCodigoNcm === 0 && semEmpresa === 0,
    }
  }

  async validarPecasNcm(): Promise<PecasSemNcmResult> {
    const semNcm = await this.prisma.precificador_historico.findMany({
      where: {
        OR: [{ ncmCodigo: null }, { ncmCodigo: '' }],
      },
      select: {
        id: true,
        produtoCodigo: true,
        produtoNome: true,
        ncmCodigo: true,
        ncmCategoria: true,
        createdAt: true,
      },
      take: 100,
      orderBy: { createdAt: 'desc' },
    })

    const total = await this.prisma.precificador_historico.count({
      where: {
        OR: [{ ncmCodigo: null }, { ncmCodigo: '' }],
      },
    })

    return { total, registros: semNcm }
  }
}
