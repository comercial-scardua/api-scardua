import { Injectable } from '@nestjs/common';
import type { PrismaService } from '../../../prisma/prisma.service';
import type { AtualizarEmpresaDto } from '../dto/atualizar-empresa.dto';
import type { CriarEmpresaDto } from '../dto/criar-empresa.dto';
import type {
  EmpresasRepository,
  ListaEmpresasResult,
} from './empresas.repository';

const INCLUDE_COMPLETO = {
  criadoPor: { select: { id: true, nome: true, email: true } },
  colaboradores: {
    where: { oculto: false },
    select: { id: true, nome: true, sobrenome: true },
  },
} as const;

const SELECT_SIMPLES = {
  id: true,
  numero: true,
  nomeEmpresa: true,
  cnpj: true,
  cidade: true,
} as const;

@Injectable()
export class PrismaEmpresasRepository implements EmpresasRepository {
  constructor(private prisma: PrismaService) {}

  async findAll({
    searchTerm,
    mostrarOcultos = false,
    page = 1,
    limit = 10,
  }: {
    searchTerm?: string;
    mostrarOcultos?: boolean;
    page?: number;
    limit?: number;
  }): Promise<ListaEmpresasResult> {
    const where = {
      oculto: mostrarOcultos ? undefined : false,
      ...(searchTerm && {
        OR: [
          { nomeEmpresa: { contains: searchTerm } },
          { cnpj: { contains: searchTerm } },
          { cidade: { contains: searchTerm } },
          { numero: { contains: searchTerm } },
        ],
      }),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.empresas.findMany({
        where,
        include: INCLUDE_COMPLETO,
        orderBy: { nomeEmpresa: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.empresas.count({ where }),
    ]);

    return { data, total, pages: Math.ceil(total / limit), page };
  }

  findSimple() {
    return this.prisma.empresas.findMany({
      where: { oculto: false },
      select: SELECT_SIMPLES,
      orderBy: { nomeEmpresa: 'asc' },
    });
  }

  findById(id: number) {
    return this.prisma.empresas.findUnique({
      where: { id },
      include: INCLUDE_COMPLETO,
    });
  }

  findByCnpj(cnpj: string) {
    return this.prisma.empresas.findUnique({
      where: { cnpj },
      select: SELECT_SIMPLES,
    });
  }

  create(data: CriarEmpresaDto, criadoPorId: string) {
    return this.prisma.empresas.create({
      data: { ...data, criadoPorId, updatedAt: new Date() },
      include: INCLUDE_COMPLETO,
    });
  }

  update(id: number, data: AtualizarEmpresaDto) {
    return this.prisma.empresas.update({
      where: { id },
      data: { ...data, updatedAt: new Date() },
      include: INCLUDE_COMPLETO,
    });
  }

  softDelete(id: number) {
    return this.prisma.empresas.update({
      where: { id },
      data: { oculto: true, updatedAt: new Date() },
      include: INCLUDE_COMPLETO,
    });
  }
}
