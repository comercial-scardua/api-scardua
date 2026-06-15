import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import type { ImportarPrecosDto } from '../dto/importar-precos.dto';

@Injectable()
export class ImportacaoPrecosRepository {
  constructor(private prisma: PrismaService) {}

  async importar(dto: ImportarPrecosDto) {
    const resultados: { codigoInterno: string; acao: string }[] = [];

    for (const item of dto.produtos) {
      const { codigoInterno, ...rest } = item;
      await this.prisma.products.upsert({
        where: { codigoInterno },
        update: { ...rest, updatedAt: new Date() },
        create: { codigoInterno, ...rest },
      });
      const existente = await this.prisma.products.findUnique({ where: { codigoInterno } });
      resultados.push({
        codigoInterno,
        acao: existente ? 'atualizado' : 'criado',
      });
    }

    return {
      total: dto.produtos.length,
      resultados,
    };
  }

  exportar(categoria?: string, grupo?: string, marca?: string) {
    const where: Record<string, unknown> = {};
    if (categoria) where.categoria = categoria;
    // grupo e marca não existem no modelo products, ignoramos silenciosamente
    return this.prisma.products.findMany({
      where,
      orderBy: { codigoInterno: 'asc' },
    });
  }

  async categorias() {
    const result = await this.prisma.products.findMany({
      distinct: ['categoria'],
      select: { categoria: true },
      orderBy: { categoria: 'asc' },
    });
    return result.map((r) => r.categoria);
  }

  // O modelo products não possui campo grupo — retorna lista vazia informativa
  async grupos() {
    return [] as string[];
  }

  // O modelo products não possui campo marca — retorna lista vazia informativa
  async marcas() {
    return [] as string[];
  }
}
