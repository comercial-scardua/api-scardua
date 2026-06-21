import { Injectable } from '@nestjs/common'
import type {
  CreateLancamentoBulkData,
  CreateLancamentoItem,
  LancamentoRepository,
} from '../../../../domain/lancamento/application/repositories/lancamento-repository'
import { PrismaService } from '../../../../prisma/prisma.service'

@Injectable()
export class PrismaLancamentoRepository implements LancamentoRepository {
  constructor(private prisma: PrismaService) {}

  async createBulk(data: CreateLancamentoBulkData) {
    if (data.clearExisting) {
      await this.prisma.lancamentos.deleteMany({
        where: { contaCorrenteId: data.contaCorrenteId },
      })
    }

    const items: CreateLancamentoItem[] = data.lancamentos?.length
      ? data.lancamentos
      : data.data
        ? [
            {
              data: data.data,
              numeroDocumento: data.numeroDocumento,
              observacao: data.observacao,
              credito: data.credito,
              debito: data.debito,
            },
          ]
        : []

    const lancamentos = await Promise.all(
      items.map((item) =>
        this.prisma.lancamentos.create({
          data: {
            contaCorrenteId: data.contaCorrenteId,
            data: new Date(item.data),
            numeroDocumento: item.numeroDocumento ?? null,
            observacao: item.observacao ?? '',
            credito: item.credito ?? null,
            debito: item.debito ?? null,
            updatedAt: new Date(),
          },
        }),
      ),
    )

    return { count: lancamentos.length, lancamentos }
  }

  async removeByContaCorrenteId(contaCorrenteId: number) {
    const result = await this.prisma.lancamentos.deleteMany({
      where: { contaCorrenteId },
    })
    return { deleted: result.count, contaCorrenteId }
  }

  findContaByColaboradorId(colaboradorId: number) {
    return this.prisma.conta_corrente.findFirst({
      where: { colaboradorId },
      select: { id: true },
    })
  }

  findLancamentoByIdAndConta(lancamentoId: number, contaCorrenteId: number) {
    return this.prisma.lancamentos.findFirst({
      where: { id: lancamentoId, contaCorrenteId },
    })
  }

  async removeLancamento(id: number) {
    await this.prisma.lancamentos.delete({ where: { id } })
  }
}
