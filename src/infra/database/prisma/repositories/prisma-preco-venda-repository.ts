import { Injectable } from '@nestjs/common'
import type {
  PrecoVendaRepository,
  ProdutoPrecoVenda,
} from '../../../../domain/preco-venda/application/repositories/preco-venda-repository'
import { PrismaService } from '../../../../prisma/prisma.service'

@Injectable()
export class PrismaPrecoVendaRepository implements PrecoVendaRepository {
  constructor(private prisma: PrismaService) {}

  async findProdutoById(id: number): Promise<ProdutoPrecoVenda | null> {
    return this.prisma.products.findUnique({ where: { id } })
  }

  async updateProdutoDescricao(
    id: number,
    descricao: string,
  ): Promise<ProdutoPrecoVenda> {
    return this.prisma.products.update({
      where: { id },
      data: { descricao, updatedAt: new Date() },
    })
  }
}
