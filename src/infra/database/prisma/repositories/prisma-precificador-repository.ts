import { Injectable } from '@nestjs/common'
import type {
  AtualizarPrecosData,
  AtualizarPrecosResult,
  PrecificadorRepository,
  SalvarPrecificacaoData,
} from '../../../../domain/precificador/application/repositories/precificador-repository'
import { PrismaService } from '../../../../prisma/prisma.service'

@Injectable()
export class PrismaPrecificadorRepository implements PrecificadorRepository {
  constructor(private prisma: PrismaService) {}

  buscarProduto(q?: string, codigo?: string) {
    if (codigo) {
      return this.prisma.products.findMany({
        where: { codigoInterno: { contains: codigo } },
        take: 50,
        orderBy: { nome: 'asc' },
      })
    }
    if (q) {
      return this.prisma.products.findMany({
        where: {
          OR: [
            { nome: { contains: q } },
            { codigoInterno: { contains: q } },
            { descricao: { contains: q } },
          ],
        },
        take: 50,
        orderBy: { nome: 'asc' },
      })
    }
    return this.prisma.products.findMany({ take: 50, orderBy: { nome: 'asc' } })
  }

  async buscarNcm(ncm?: string) {
    if (!ncm) return []
    return this.prisma.ncm.findMany({
      where: {
        codigo_ncm: { contains: ncm },
        ativo: true,
      },
      take: 50,
      orderBy: { codigo_ncm: 'asc' },
    })
  }

  async buscarFornecedor(fornecedor?: string) {
    if (!fornecedor) return []
    return this.prisma.precificador_historico.findMany({
      where: { empresaNome: { contains: fornecedor } },
      distinct: ['produtoCodigo'],
      take: 50,
      orderBy: { createdAt: 'desc' },
    })
  }

  async buscarNf(nf?: string, fornecedor?: string) {
    if (!nf && !fornecedor) return []
    return this.prisma.stock_entries.findMany({
      where: {
        ...(nf ? { numeroNotaFiscal: { contains: nf } } : {}),
      },
      take: 50,
      orderBy: { dataEntrada: 'desc' },
    })
  }

  async buscarNfImportacao(nf?: string) {
    if (!nf) return []
    return this.prisma.stock_entries.findMany({
      where: { numeroNotaFiscal: { contains: nf } },
      take: 50,
      orderBy: { dataEntrada: 'desc' },
    })
  }

  async historico(produtoId?: number, page = 1, limit = 20) {
    const skip = (page - 1) * limit

    const where = produtoId
      ? {
          OR: [{ produtoCodigo: String(produtoId) }],
        }
      : {}

    const [total, dados] = await Promise.all([
      this.prisma.precificador_historico.count({ where }),
      this.prisma.precificador_historico.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          user: {
            select: { id: true, nome: true, sobrenome: true, email: true },
          },
        },
      }),
    ])

    return {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
      dados,
    }
  }

  salvar(dto: SalvarPrecificacaoData) {
    return this.prisma.precificador_historico.create({
      data: {
        userId: dto.userId,
        empresaId: dto.empresaId,
        empresaNome: dto.empresaNome,
        produtoCodigo: dto.produtoCodigo,
        produtoNome: dto.produtoNome,
        posicaoFiscal: dto.posicaoFiscal ?? null,
        tipoPrecoBase: dto.tipoPrecoBase,
        custoBase: dto.custoBase,
        custosFixosPerc: dto.custosFixosPerc,
        outrosCustosCompraPerc: dto.outrosCustosCompraPerc,
        outrosCustosVendaPerc: dto.outrosCustosVendaPerc,
        lucroPercDesejado: dto.lucroPercDesejado,
        ncmCodigo: dto.ncmCodigo ?? null,
        ncmCategoria: dto.ncmCategoria ?? null,
        vendaFora: dto.vendaFora,
        precoFinal: dto.precoFinal,
        lucroLiquido: dto.lucroLiquido,
        margemLiquida: dto.margemLiquida,
      },
      include: { user: { select: { id: true, nome: true, sobrenome: true } } },
    })
  }

  async atualizarPrecos(
    dto: AtualizarPrecosData,
  ): Promise<AtualizarPrecosResult> {
    const resultados: {
      produtoId: number
      status: string
      preco?: number
      erro?: string
    }[] = []

    for (const item of dto.itens) {
      const produto = await this.prisma.products.findUnique({
        where: { id: item.produtoId },
      })
      if (!produto) {
        resultados.push({
          produtoId: item.produtoId,
          status: 'erro',
          erro: 'Produto não encontrado',
        })
        continue
      }

      const descricaoAtualizada = JSON.stringify({
        ...(produto.descricao
          ? (() => {
              try {
                return JSON.parse(produto.descricao)
              } catch {
                return { texto: produto.descricao }
              }
            })()
          : {}),
        precoVenda: item.preco,
      })

      await this.prisma.products.update({
        where: { id: item.produtoId },
        data: { descricao: descricaoAtualizada, updatedAt: new Date() },
      })

      resultados.push({
        produtoId: item.produtoId,
        status: 'atualizado',
        preco: item.preco,
      })
    }

    return { total: dto.itens.length, resultados }
  }
}
