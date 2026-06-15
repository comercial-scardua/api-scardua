import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import type { CriarRelatorioDto } from '../dto/criar-relatorio.dto';

@Injectable()
export class RelatoriosRepository {
  constructor(private prisma: PrismaService) {}

  findAll(filters: {
    departamento?: string;
    restrito?: boolean;
    search?: string;
  }) {
    const where: Record<string, unknown> = { ativo: true };

    if (filters.departamento) {
      where['departamento'] = filters.departamento;
    }

    if (filters.restrito !== undefined) {
      where['restrito'] = filters.restrito;
    }

    if (filters.search) {
      where['OR'] = [
        { nome: { contains: filters.search } },
        { descricao: { contains: filters.search } },
        { departamento: { contains: filters.search } },
      ];
    }

    return this.prisma.relatorios.findMany({
      where,
      orderBy: { nome: 'asc' },
    });
  }

  findById(id: number) {
    return this.prisma.relatorios.findUnique({ where: { id } });
  }

  create(data: CriarRelatorioDto) {
    return this.prisma.relatorios.create({
      data: {
        ...data,
        data_criacao: new Date(),
        data_modificado: new Date(),
      },
    });
  }

  update(id: number, data: Partial<CriarRelatorioDto>) {
    return this.prisma.relatorios.update({
      where: { id },
      data: { ...data, data_modificado: new Date() },
    });
  }

  remove(id: number) {
    return this.prisma.relatorios.update({
      where: { id },
      data: { ativo: false, data_modificado: new Date() },
    });
  }

  getPermissions(relatorioId: number) {
    return this.prisma.relatorio_permissions.findMany({
      where: { relatorio_id: relatorioId },
    });
  }

  async setPermissions(relatorioId: number, userIds: string[]) {
    await this.prisma.relatorio_permissions.deleteMany({ where: { relatorio_id: relatorioId } });

    if (userIds.length > 0) {
      await this.prisma.relatorio_permissions.createMany({
        data: userIds.map((user_id) => ({ relatorio_id: relatorioId, user_id })),
        skipDuplicates: true,
      });
    }

    return this.prisma.relatorio_permissions.findMany({ where: { relatorio_id: relatorioId } });
  }
}
