import { Injectable } from '@nestjs/common';
import type { colaboradores } from '@prisma/client';
import type { PrismaService } from '../../../prisma/prisma.service';
import type { CriarColaboradorDto } from '../dto/criar-colaborador.dto';
import type { ColaboradoresRepository } from './colaboradores.repository';

@Injectable()
export class PrismaColaboradoresRepository implements ColaboradoresRepository {
  constructor(private prisma: PrismaService) {}

  findAll({ cpf, simple }: { cpf?: string; simple?: boolean }) {
    const normalizedCpf = cpf?.replace(/[.-]/g, '');
    const where = normalizedCpf ? { cpf: normalizedCpf } : { oculto: false };

    if (simple) {
      return this.prisma.colaboradores.findMany({
        where,
        select: {
          id: true,
          nome: true,
          sobrenome: true,
          cpf: true,
          identidade: true,
        },
      });
    }

    return this.prisma.colaboradores.findMany({
      where,
      include: { empresa: true, horarioTrabalho: true },
    });
  }

  findById(id: number) {
    return this.prisma.colaboradores.findUnique({
      where: { id },
      include: { empresa: true, horarioTrabalho: true },
    });
  }

  findByEmail(email: string) {
    return this.prisma.colaboradores.findFirst({ where: { email } });
  }

  async create(data: CriarColaboradorDto): Promise<colaboradores> {
    const { horaInicio, horaFim, admissao, ...rest } = data;

    const colaborador = await this.prisma.colaboradores.create({
      data: {
        ...rest,
        admissao: admissao ? new Date(admissao) : undefined,
        updatedAt: new Date(),
        horarioTrabalho:
          horaInicio && horaFim
            ? { create: { horaInicio, horaFim, updatedAt: new Date() } }
            : undefined,
      },
    });

    return colaborador;
  }

  async update(
    id: number,
    data: Partial<CriarColaboradorDto>,
  ): Promise<colaboradores> {
    const { horaInicio, horaFim, ...rest } = data;

    return this.prisma.colaboradores.update({
      where: { id },
      data: { ...rest, updatedAt: new Date() },
    });
  }

  softDelete(id: number): Promise<colaboradores> {
    return this.prisma.colaboradores.update({
      where: { id },
      data: { oculto: true, updatedAt: new Date() },
    });
  }
}
