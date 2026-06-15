import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import type { CriarLancamentoViagemDto } from '../dto/criar-lancamento-viagem.dto';

@Injectable()
export class LancamentoViagemRepository {
  constructor(private prisma: PrismaService) {}

  findAll(filters: { caixaId?: number; tipo?: string; userId?: string }) {
    const where: Record<string, unknown> = {};

    if (filters.caixaId !== undefined) {
      where['caixaViagemId'] = filters.caixaId;
    }

    // viagemlancamento doesn't have a tipo field — filter by custo as a proxy if needed
    // userId filter requires join through caixaviagem
    if (filters.userId !== undefined) {
      where['caixaViagem'] = { userId: filters.userId };
    }

    return this.prisma.viagemlancamento.findMany({
      where,
      include: {
        caixaViagem: {
          select: { id: true, destino: true, data: true, funcionarioId: true },
        },
      },
      orderBy: { data: 'desc' },
    });
  }

  create(dto: CriarLancamentoViagemDto) {
    return this.prisma.viagemlancamento.create({
      data: {
        caixaViagemId: dto.caixaViagemId ?? null,
        data: new Date(dto.data),
        custo: dto.custo,
        clienteFornecedor: dto.clienteFornecedor,
        entrada: dto.entrada ?? null,
        saida: dto.saida ?? null,
        numeroDocumento: dto.numeroDocumento ?? null,
        historicoDoc: dto.historicoDoc ?? null,
        updatedAt: new Date(),
      },
    });
  }

  async findByColaboradorId(colaboradorId: number) {
    const caixas = await this.prisma.caixaviagem.findMany({
      where: { funcionarioId: colaboradorId },
      select: { id: true },
    });

    if (caixas.length === 0) return [];

    const caixaIds = caixas.map((c) => c.id);

    return this.prisma.viagemlancamento.findMany({
      where: { caixaViagemId: { in: caixaIds } },
      include: {
        caixaViagem: {
          select: { id: true, destino: true, data: true, funcionarioId: true },
        },
      },
      orderBy: { data: 'desc' },
    });
  }

  async createForColaborador(
    colaboradorId: number,
    dto: Omit<CriarLancamentoViagemDto, 'caixaViagemId'>,
  ) {
    const caixa = await this.prisma.caixaviagem.findFirst({
      where: { funcionarioId: colaboradorId, oculto: false },
      orderBy: { data: 'desc' },
    });

    if (!caixa)
      throw new NotFoundException(
        `Caixa viagem ativo para colaborador #${colaboradorId} não encontrado`,
      );

    return this.prisma.viagemlancamento.create({
      data: {
        caixaViagemId: caixa.id,
        data: new Date(dto.data),
        custo: dto.custo,
        clienteFornecedor: dto.clienteFornecedor,
        entrada: dto.entrada ?? null,
        saida: dto.saida ?? null,
        numeroDocumento: dto.numeroDocumento ?? null,
        historicoDoc: dto.historicoDoc ?? null,
        updatedAt: new Date(),
      },
    });
  }
}
