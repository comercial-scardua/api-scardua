import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../../prisma/prisma.service'
import type {
  CriarLancamentoDto,
  LancamentoBulkDto,
} from '../dto/criar-lancamento.dto'

@Injectable()
export class LancamentoRepository {
  constructor(private prisma: PrismaService) {}

  create(dto: CriarLancamentoDto) {
    return this.prisma.lancamentos.create({
      data: {
        contaCorrenteId: dto.contaCorrenteId,
        data: new Date(dto.data),
        numeroDocumento: dto.numeroDocumento ?? null,
        observacao: dto.observacao ?? '',
        credito: dto.credito ?? null,
        debito: dto.debito ?? null,
        updatedAt: new Date(),
      },
    })
  }

  async remove(id: number) {
    const exists = await this.prisma.lancamentos.findUnique({ where: { id } })
    if (!exists) throw new NotFoundException(`Lançamento #${id} não encontrado`)
    await this.prisma.lancamentos.delete({ where: { id } })
  }

  async removeByContaCorrenteId(contaCorrenteId: number) {
    const result = await this.prisma.lancamentos.deleteMany({
      where: { contaCorrenteId },
    })
    return { deleted: result.count, contaCorrenteId }
  }

  async createBulk(dto: LancamentoBulkDto) {
    if (dto.clearExisting) {
      await this.prisma.lancamentos.deleteMany({
        where: { contaCorrenteId: dto.contaCorrenteId },
      })
    }

    const items = dto.lancamentos?.length
      ? dto.lancamentos
      : dto.data
        ? [
            {
              data: dto.data,
              numeroDocumento: dto.numeroDocumento,
              observacao: dto.observacao,
              credito: dto.credito,
              debito: dto.debito,
            },
          ]
        : []

    const criados = await Promise.all(
      items.map((item) =>
        this.prisma.lancamentos.create({
          data: {
            contaCorrenteId: dto.contaCorrenteId,
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

    return {
      success: true,
      message: `${criados.length} lançamento(s) criado(s)`,
      lancamentos: criados,
    }
  }

  async createBulkForUser(userId: number, dto: LancamentoBulkDto) {
    const conta = await this.prisma.conta_corrente.findFirst({
      where: { colaboradorId: userId },
    })
    if (!conta)
      throw new NotFoundException(
        `Conta corrente para colaborador #${userId} não encontrada`,
      )

    return this.createBulk({ ...dto, contaCorrenteId: conta.id })
  }

  async createForUser(
    userId: number,
    dto: Omit<CriarLancamentoDto, 'contaCorrenteId'>,
  ) {
    const conta = await this.prisma.conta_corrente.findFirst({
      where: { colaboradorId: userId },
    })
    if (!conta)
      throw new NotFoundException(
        `Conta corrente para colaborador #${userId} não encontrada`,
      )

    return this.prisma.lancamentos.create({
      data: {
        contaCorrenteId: conta.id,
        data: new Date(dto.data),
        numeroDocumento: dto.numeroDocumento ?? null,
        observacao: dto.observacao ?? '',
        credito: dto.credito ?? null,
        debito: dto.debito ?? null,
        updatedAt: new Date(),
      },
    })
  }

  async removeForUser(userId: number, lancamentoId: number) {
    const conta = await this.prisma.conta_corrente.findFirst({
      where: { colaboradorId: userId },
    })
    if (!conta)
      throw new NotFoundException(
        `Conta corrente para colaborador #${userId} não encontrada`,
      )

    const lancamento = await this.prisma.lancamentos.findFirst({
      where: { id: lancamentoId, contaCorrenteId: conta.id },
    })
    if (!lancamento)
      throw new NotFoundException(
        `Lançamento #${lancamentoId} não encontrado para este usuário`,
      )

    await this.prisma.lancamentos.delete({ where: { id: lancamentoId } })
  }
}
