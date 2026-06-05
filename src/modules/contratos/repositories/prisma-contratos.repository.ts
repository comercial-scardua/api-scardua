import { Injectable } from '@nestjs/common';
import type { PrismaService } from '../../../prisma/prisma.service';
import type { AtualizarContratoDto } from '../dto/atualizar-contrato.dto';
import type { CriarContratoDto } from '../dto/criar-contrato.dto';
import type { ContratosRepository } from './contratos.repository';

const INCLUDE_ARQUIVOS = { arquivos: true } as const;

@Injectable()
export class PrismaContratosRepository implements ContratosRepository {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.contratos.findMany({
      where: { status: { not: 'excluido' } },
      include: INCLUDE_ARQUIVOS,
      orderBy: { data_vencimento: 'asc' },
    });
  }

  findById(id: number) {
    return this.prisma.contratos.findUnique({
      where: { id },
      include: INCLUDE_ARQUIVOS,
    });
  }

  findByNumero(numero: string) {
    return this.prisma.contratos.findFirst({ where: { numero } });
  }

  create(data: CriarContratoDto) {
    return this.prisma.contratos.create({
      data: {
        ...data,
        data_inicio: new Date(data.data_inicio),
        data_vencimento: data.vencimento_indeterminado
          ? null
          : data.data_vencimento
            ? new Date(data.data_vencimento)
            : null,
        status: 'ativo',
        data_criacao: new Date(),
        data_modificado: new Date(),
      },
    });
  }

  update(id: number, data: AtualizarContratoDto) {
    return this.prisma.contratos.update({
      where: { id },
      data: {
        ...data,
        ...(data.data_inicio && { data_inicio: new Date(data.data_inicio) }),
        ...(data.data_vencimento !== undefined && {
          data_vencimento: data.vencimento_indeterminado
            ? null
            : data.data_vencimento
              ? new Date(data.data_vencimento)
              : null,
        }),
        data_modificado: new Date(),
      },
    });
  }

  async alternarStatus(id: number) {
    const contrato = await this.prisma.contratos.findUniqueOrThrow({ where: { id } });
    const novoStatus = contrato.status === 'ativo' ? 'finalizado' : 'ativo';
    return this.prisma.contratos.update({
      where: { id },
      data: { status: novoStatus, data_modificado: new Date() },
    });
  }

  async renovar(id: number) {
    const contrato = await this.prisma.contratos.findUniqueOrThrow({ where: { id } });
    const base = contrato.data_vencimento ?? new Date();
    const novaData = new Date(base);
    novaData.setDate(novaData.getDate() + 30);
    return this.prisma.contratos.update({
      where: { id },
      data: { data_vencimento: novaData, data_modificado: new Date() },
    });
  }

  async excluir(id: number): Promise<void> {
    await this.prisma.contratos.update({
      where: { id },
      data: { status: 'excluido', data_modificado: new Date() },
    });
  }

  adicionarArquivo(
    contratoId: number,
    arquivo: {
      nome_original: string;
      nome: string;
      caminho_arquivo: string;
      tipo_arquivo?: string;
      tamanho_arquivo?: number;
    },
  ) {
    return this.prisma.contrato_arquivos.create({
      data: { contrato_id: contratoId, ...arquivo },
    });
  }

  async removerArquivo(contratoId: number, arquivoId: number) {
    const arquivo = await this.prisma.contrato_arquivos.findFirst({
      where: { id: arquivoId, contrato_id: contratoId },
    });
    if (!arquivo) return null;

    await this.prisma.contrato_arquivos.delete({ where: { id: arquivoId } });
    return arquivo;
  }
}
