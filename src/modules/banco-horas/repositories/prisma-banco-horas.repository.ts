import { Injectable } from '@nestjs/common';
import type { conta_corrente_horas, registros_banco_horas } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import type { RegistrarPontoDto } from '../dto/registrar-ponto.dto';
import { BancoHorasRepository } from './banco-horas.repository';

@Injectable()
export class PrismaBancoHorasRepository implements BancoHorasRepository {
  constructor(private prisma: PrismaService) {}

  async listarRegistros(
    colaboradorId: number,
    dataInicio?: Date,
    dataFim?: Date,
  ): Promise<registros_banco_horas[]> {
    return this.prisma.registros_banco_horas.findMany({
      where: {
        colaborador_id: colaboradorId,
        ...(dataInicio || dataFim
          ? {
              data: {
                ...(dataInicio && { gte: dataInicio }),
                ...(dataFim && { lte: dataFim }),
              },
            }
          : {}),
      },
      orderBy: { data: 'desc' },
    });
  }

  async buscarRegistro(id: number): Promise<registros_banco_horas | null> {
    return this.prisma.registros_banco_horas.findUnique({
      where: { id },
    });
  }

  async criarRegistro(data: RegistrarPontoDto): Promise<registros_banco_horas> {
    const colaborador = await this.prisma.colaboradores.findUnique({
      where: { id: data.colaboradorId },
    });

    if (!colaborador) {
      throw new Error(`Colaborador #${data.colaboradorId} não encontrado`);
    }

    return this.prisma.registros_banco_horas.create({
      data: {
        colaborador_id: data.colaboradorId,
        funcionario_nome: `${colaborador.nome} ${colaborador.sobrenome}`.trim(),
        tipo: data.tipo,
        data: data.data,
        acao: data.acao || data.tipo,
        hora_inicio: data.horaInicio,
        hora_fim: data.horaFim,
        intervalo_minutos: data.intervaloMinutos || 0,
        horas_corrigidas: data.horasCorrigidas ? data.horasCorrigidas : null,
        observacao: data.observacao,
        data_criacao: new Date(),
        data_modificado: new Date(),
      },
    });
  }

  async atualizarRegistro(
    id: number,
    data: Partial<RegistrarPontoDto>,
  ): Promise<registros_banco_horas> {
    const registro = await this.buscarRegistro(id);
    if (!registro) {
      throw new Error(`Registro #${id} não encontrado`);
    }

    return this.prisma.registros_banco_horas.update({
      where: { id },
      data: {
        ...(data.tipo && { tipo: data.tipo }),
        ...(data.horaInicio && { hora_inicio: data.horaInicio }),
        ...(data.horaFim && { hora_fim: data.horaFim }),
        ...(data.intervaloMinutos !== undefined && { intervalo_minutos: data.intervaloMinutos }),
        ...(data.horasCorrigidas !== undefined && { horas_corrigidas: data.horasCorrigidas }),
        ...(data.acao && { acao: data.acao }),
        ...(data.observacao !== undefined && { observacao: data.observacao }),
        data_modificado: new Date(),
      },
    });
  }

  async deletarRegistro(id: number): Promise<registros_banco_horas> {
    const registro = await this.buscarRegistro(id);
    if (!registro) {
      throw new Error(`Registro #${id} não encontrado`);
    }

    return this.prisma.registros_banco_horas.delete({
      where: { id },
    });
  }

  async obterSaldoHoras(colaboradorId: number): Promise<conta_corrente_horas | null> {
    return this.prisma.conta_corrente_horas.findUnique({
      where: { colaborador_id: colaboradorId },
    });
  }

  async listarSaldosPorColaborador(): Promise<conta_corrente_horas[]> {
    return this.prisma.conta_corrente_horas.findMany({
      orderBy: { funcionario_nome: 'asc' },
    });
  }
}
