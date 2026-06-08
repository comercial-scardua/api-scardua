import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import type { AtualizarPatrimonioDto } from '../dto/atualizar-patrimonio.dto';
import type { CriarPatrimonioDto } from '../dto/criar-patrimonio.dto';
import type { PatrimoniosRepository } from './patrimonios.repository';

const INCLUDE_COMPLETO = {
  responsavel: {
    select: { id: true, nome: true, sobrenome: true, cargo: true, setor: true },
  },
  movimentacoes: {
    take: 1,
    orderBy: { createdAt: 'desc' as const },
    include: {
      autor: { select: { id: true, nome: true, sobrenome: true } },
      responsavelNovo: { select: { id: true, nome: true, sobrenome: true } },
      responsavelAnterior: { select: { id: true, nome: true, sobrenome: true } },
    },
  },
} as const;

@Injectable()
export class PrismaPatrimoniosRepository implements PatrimoniosRepository {
  constructor(private prisma: PrismaService) {}

  findAll(showHidden = false) {
    return this.prisma.patrimonios.findMany({
      where: showHidden ? {} : { oculto: false },
      include: INCLUDE_COMPLETO,
      orderBy: { createdAt: 'desc' },
    }) as any;
  }

  findById(id: number) {
    return this.prisma.patrimonios.findUnique({
      where: { id },
      include: INCLUDE_COMPLETO,
    }) as any;
  }

  async findVeiculos() {
    const veiculos = await this.prisma.patrimonios.findMany({
      where: { tipo: 'VEICULO', oculto: false },
      select: { id: true, nome: true, modelo: true, placa: true },
      orderBy: { modelo: 'asc' },
    });

    return veiculos.map((v) => ({
      id: v.id,
      nome: v.nome,
      modelo: v.modelo ?? v.nome,
      placa: v.placa ?? '',
    }));
  }

  async findBySerial(serial: string, skipId?: number) {
    if (!serial.trim()) return null;

    return this.prisma.patrimonios.findFirst({
      where: {
        numeroSerie: serial,
        oculto: false,
        ...(skipId && { id: { not: skipId } }),
      },
      select: { id: true, nome: true, tipo: true },
    });
  }

  async stats() {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const [patrimonios, movimentacoes] = await Promise.all([
      this.prisma.patrimonios.findMany({
        where: { oculto: false },
        include: { responsavel: { select: { setor: true } } },
      }),
      this.prisma.movimentacoes.findMany({
        where: { createdAt: { gte: sixMonthsAgo } },
      }),
    ]);

    const porTipo: Record<string, number> = {};
    const porSetor: Record<string, number> = {};

    for (const p of patrimonios) {
      porTipo[p.tipo] = (porTipo[p.tipo] ?? 0) + 1;
      const setor = p.responsavel?.setor ?? 'Sem Setor';
      porSetor[setor] = (porSetor[setor] ?? 0) + 1;
    }

    const movimentacoesPorMes: Record<string, number> = {};
    for (const m of movimentacoes) {
      const mes = m.createdAt.toLocaleString('pt-BR', { month: 'long' });
      movimentacoesPorMes[mes] = (movimentacoesPorMes[mes] ?? 0) + 1;
    }

    return { porTipo, porSetor, movimentacoesPorMes };
  }

  create(data: CriarPatrimonioDto) {
    const { locado, franquia, tipo, ...rest } = data;

    return this.prisma.patrimonios.create({
      data: {
        ...rest,
        nome: data.nome ?? (tipo === 'Linhas Telefônicas' ? 'Linhas Telefônica' : ''),
        tipo,
        locado: locado ?? false,
        franquia: locado ? franquia : undefined,
        data_aquisicao: data.data_aquisicao ? new Date(data.data_aquisicao) : undefined,
        dataNotaFiscal: data.dataNotaFiscal ? new Date(data.dataNotaFiscal) : undefined,
        dataGarantia: data.dataGarantia ? new Date(data.dataGarantia) : undefined,
        dataVencimentoSeguro: data.dataVencimentoSeguro
          ? new Date(data.dataVencimentoSeguro)
          : undefined,
        updatedAt: new Date(),
      },
    });
  }

  update(id: number, data: AtualizarPatrimonioDto) {
    const { locado, franquia, ...rest } = data;

    return this.prisma.patrimonios.update({
      where: { id },
      data: {
        ...rest,
        locado,
        franquia: locado ? franquia : undefined,
        data_aquisicao: data.data_aquisicao ? new Date(data.data_aquisicao) : undefined,
        dataNotaFiscal: data.dataNotaFiscal ? new Date(data.dataNotaFiscal) : undefined,
        dataGarantia: data.dataGarantia ? new Date(data.dataGarantia) : undefined,
        dataVencimentoSeguro: data.dataVencimentoSeguro
          ? new Date(data.dataVencimentoSeguro)
          : undefined,
        updatedAt: new Date(),
      },
    });
  }

  async criarMovimentacao(data: {
    patrimonioId: number;
    tipo: string;
    autorId?: number | null;
    responsavelAnteriorId?: number | null;
    responsavelNovoId?: number | null;
    localizacaoAnterior?: string | null;
    localizacaoNova?: string | null;
    kmAnterior?: string | null;
    kmNovo?: string | null;
  }): Promise<void> {
    await this.prisma.movimentacoes.create({
      data: { ...data, updatedAt: new Date() },
    });
  }

  async toggleOculto(id: number) {
    const atual = await this.prisma.patrimonios.findUniqueOrThrow({ where: { id } });
    return this.prisma.patrimonios.update({
      where: { id },
      data: { oculto: !atual.oculto, updatedAt: new Date() },
    });
  }
}
