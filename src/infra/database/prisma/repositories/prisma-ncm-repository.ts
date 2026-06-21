import { Injectable } from '@nestjs/common'
import type { ncm } from '@prisma/client'
import type {
  AtualizarNcmData,
  CriarNcmData,
  NcmUniqueKey,
} from '../../../../domain/ncm/application/repositories/ncm-repository'
import { NcmRepository } from '../../../../domain/ncm/application/repositories/ncm-repository'
import { PrismaService } from '../../../../prisma/prisma.service'

@Injectable()
export class PrismaNcmRepository implements NcmRepository {
  constructor(private prisma: PrismaService) {}

  findAll({
    termo,
    categoria,
    empresa,
    uf_emissor,
    uf_destino,
  }: {
    termo?: string
    categoria?: string
    empresa?: string
    uf_emissor?: string
    uf_destino?: string
  }) {
    return this.prisma.ncm.findMany({
      where: {
        ativo: true,
        ...(categoria && { categoria_cliente: { contains: categoria } }),
        ...(empresa && { empresa: { contains: empresa } }),
        ...(uf_emissor && { uf_emissor }),
        ...(uf_destino && { uf_destino }),
        ...(termo && {
          OR: [
            { codigo_ncm: { contains: termo } },
            { obs_fonte: { contains: termo } },
          ],
        }),
      },
      orderBy: { codigo_ncm: 'asc' },
    })
  }

  findById(id: number) {
    return this.prisma.ncm.findUnique({ where: { id } })
  }

  findByUniqueKey(key: NcmUniqueKey) {
    return this.prisma.ncm.findUnique({
      where: {
        codigo_ncm_categoria_cliente_empresa_uf_emissor_uf_destino_cst_origem:
          key,
      },
    })
  }

  create(data: CriarNcmData, usuarioNome: string): Promise<ncm> {
    return this.prisma.ncm.create({
      data: {
        ...data,
        codigo_ncm: data.codigo_ncm.trim(),
        categoria_cliente: data.categoria_cliente.trim(),
        empresa: data.empresa.trim(),
        uf_emissor: data.uf_emissor.trim().toUpperCase(),
        uf_destino: data.uf_destino.trim().toUpperCase(),
        usuario_nome: usuarioNome,
        ativo: true,
      },
    })
  }

  update(id: number, data: AtualizarNcmData): Promise<ncm> {
    return this.prisma.ncm.update({
      where: { id },
      data: { ...data, data_modificado: new Date() },
    })
  }

  desativar(id: number): Promise<ncm> {
    return this.prisma.ncm.update({
      where: { id },
      data: { ativo: false, data_modificado: new Date() },
    })
  }

  async importar(
    itens: CriarNcmData[],
    usuarioNome: string,
  ): Promise<{ criados: number; atualizados: number }> {
    let criados = 0
    let atualizados = 0

    for (const item of itens) {
      const key: NcmUniqueKey = {
        codigo_ncm: item.codigo_ncm.trim(),
        categoria_cliente: item.categoria_cliente.trim(),
        empresa: item.empresa.trim(),
        uf_emissor: item.uf_emissor.trim().toUpperCase(),
        uf_destino: item.uf_destino.trim().toUpperCase(),
        cst_origem: item.cst_origem ?? '',
      }

      const existe = await this.findByUniqueKey(key)

      if (existe) {
        await this.prisma.ncm.update({
          where: { id: existe.id },
          data: { ...item, ...key, data_modificado: new Date() },
        })
        atualizados++
      } else {
        await this.prisma.ncm.create({
          data: { ...item, ...key, usuario_nome: usuarioNome, ativo: true },
        })
        criados++
      }
    }

    return { criados, atualizados }
  }
}
