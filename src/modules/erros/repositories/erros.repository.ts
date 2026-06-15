import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import type { CriarErroDto } from '../dto/criar-erro.dto';

@Injectable()
export class ErrosRepository {
  constructor(private prisma: PrismaService) {}

  findAll(filters: { categoria?: string; restrito?: boolean; search?: string }) {
    const where: Record<string, unknown> = { ativo: true };

    if (filters.categoria) {
      where['categoria'] = filters.categoria;
    }

    if (filters.restrito !== undefined) {
      where['restrito'] = filters.restrito;
    }

    if (filters.search) {
      where['OR'] = [
        { titulo: { contains: filters.search } },
        { descricao: { contains: filters.search } },
        { solucao: { contains: filters.search } },
        { tags: { contains: filters.search } },
        { categoria: { contains: filters.search } },
      ];
    }

    return this.prisma.erros_solucoes.findMany({
      where,
      orderBy: { titulo: 'asc' },
    });
  }

  async findById(id: number) {
    const erro = await this.prisma.erros_solucoes.findUnique({ where: { id } });
    if (!erro) return null;

    const arquivos = await this.prisma.erro_arquivos.findMany({
      where: { erro_id: id },
      orderBy: { data_upload: 'asc' },
    });

    return { ...erro, arquivos };
  }

  create(data: CriarErroDto) {
    return this.prisma.erros_solucoes.create({
      data: {
        ...data,
        data_upload: new Date(),
        data_modificado: new Date(),
      },
    });
  }

  update(id: number, data: Partial<CriarErroDto>) {
    return this.prisma.erros_solucoes.update({
      where: { id },
      data: { ...data, data_modificado: new Date() },
    });
  }
}
