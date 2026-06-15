import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import type { CriarEventoDto } from '../dto/criar-evento.dto';

@Injectable()
export class EventosRepository {
  constructor(private prisma: PrismaService) {}

  findAll(filters: {
    mes?: number;
    ano?: number;
    tipo?: string;
    empresaId?: number;
    oculto?: boolean;
  }) {
    const where: Record<string, unknown> = {};

    if (filters.tipo) {
      where['tipo'] = filters.tipo;
    }

    if (filters.empresaId !== undefined) {
      where['empresaId'] = filters.empresaId;
    }

    if (filters.oculto !== undefined) {
      where['oculto'] = filters.oculto;
    } else {
      where['oculto'] = false;
    }

    if (filters.mes !== undefined && filters.ano !== undefined) {
      const inicio = new Date(filters.ano, filters.mes - 1, 1);
      const fim = new Date(filters.ano, filters.mes, 1);
      where['dataInicio'] = { gte: inicio, lt: fim };
    } else if (filters.ano !== undefined) {
      const inicio = new Date(filters.ano, 0, 1);
      const fim = new Date(filters.ano + 1, 0, 1);
      where['dataInicio'] = { gte: inicio, lt: fim };
    }

    return this.prisma.eventos.findMany({
      where,
      orderBy: { dataInicio: 'asc' },
    });
  }

  findById(id: number) {
    return this.prisma.eventos.findUnique({ where: { id } });
  }

  create(data: CriarEventoDto, criadoPorId: string) {
    return this.prisma.eventos.create({
      data: {
        ...data,
        criadoPorId,
        updatedAt: new Date(),
      },
    });
  }

  update(id: number, data: Partial<CriarEventoDto>) {
    return this.prisma.eventos.update({
      where: { id },
      data: { ...data, updatedAt: new Date() },
    });
  }

  softDelete(id: number) {
    return this.prisma.eventos.update({
      where: { id },
      data: { oculto: true, updatedAt: new Date() },
    });
  }
}
