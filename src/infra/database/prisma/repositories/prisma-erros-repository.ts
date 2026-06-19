import { Injectable } from '@nestjs/common'
import {
  type CreateErroData,
  type ErrosRepository,
  type FindAllErrosFilters,
  type UpdateErroData,
} from '../../../../domain/erros/application/repositories/erros-repository'
import { PrismaService } from '../../../../prisma/prisma.service'

@Injectable()
export class PrismaErrosRepository implements ErrosRepository {
  constructor(private prisma: PrismaService) {}

  findAll(filters: FindAllErrosFilters) {
    const where: Record<string, unknown> = { ativo: true }

    if (filters.categoria) where.categoria = filters.categoria
    if (filters.restrito !== undefined) where.restrito = filters.restrito

    if (filters.search) {
      where.OR = [
        { titulo: { contains: filters.search } },
        { descricao: { contains: filters.search } },
        { solucao: { contains: filters.search } },
        { tags: { contains: filters.search } },
        { categoria: { contains: filters.search } },
      ]
    }

    return this.prisma.erros_solucoes.findMany({
      where,
      orderBy: { titulo: 'asc' },
    })
  }

  async findById(id: number) {
    const erro = await this.prisma.erros_solucoes.findUnique({ where: { id } })
    if (!erro) return null

    const arquivos = await this.prisma.erro_arquivos.findMany({
      where: { erro_id: id },
      orderBy: { data_upload: 'asc' },
    })

    return { ...erro, arquivos }
  }

  create(data: CreateErroData) {
    return this.prisma.erros_solucoes.create({
      data: {
        ...data,
        data_upload: new Date(),
        data_modificado: new Date(),
      },
    })
  }

  update(id: number, data: UpdateErroData) {
    return this.prisma.erros_solucoes.update({
      where: { id },
      data: { ...data, data_modificado: new Date() },
    })
  }
}
