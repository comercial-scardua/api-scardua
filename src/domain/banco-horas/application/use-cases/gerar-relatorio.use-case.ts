import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../../../prisma/prisma.service'
import { CalculoHorasUtil } from '../utils/calculo-horas.util'
import { ObterEstatisticasUseCase } from './obter-estatisticas.use-case'

interface RegistroDetalhado {
  id: number
  colaboradorNome: string
  tipo: string
  data: string
  horaInicio?: string | null
  horaFim?: string | null
  horasCalculadas: string
  observacao?: string | null
}

interface RelatorioHoras {
  titulo: string
  dataGeracao: string
  periodo: {
    inicio: string
    fim: string
  }
  resumo: {
    totalTrabalhado: number
    totalAusencias: number
    totalDescontado: number
    saldoAcumulado: number
    totalFuncionarios: number
    totalRegistros: number
  }
  contasCorrentes: any[]
  registros: RegistroDetalhado[]
  detalhePorColaborador: any[]
}

@Injectable()
export class GerarRelatorioUseCase {
  constructor(
    private prisma: PrismaService,
    private obterEstatisticas: ObterEstatisticasUseCase,
  ) {}

  async execute(
    dataInicio?: Date,
    dataFim?: Date,
    colaboradorId?: number,
  ): Promise<RelatorioHoras> {
    const where: any = {}

    if (dataInicio || dataFim) {
      where.data = {}
      if (dataInicio) where.data.gte = dataInicio
      if (dataFim) where.data.lte = dataFim
    }

    if (colaboradorId) {
      where.colaborador_id = colaboradorId
    }

    const registros = await this.prisma.registros_banco_horas.findMany({
      where,
      orderBy: [{ data: 'desc' }, { id: 'desc' }],
    })

    const contas = await this.prisma.conta_corrente_horas.findMany({
      where: colaboradorId ? { colaborador_id: colaboradorId } : {},
    })

    const colaboradores = await this.prisma.colaboradores.findMany({
      where: colaboradorId ? { id: colaboradorId } : {},
      include: { registrosBancoHoras: true },
    })

    const estatisticas = await this.obterEstatisticas.execute(
      dataInicio,
      dataFim,
      colaboradorId,
    )

    const registrosDetalhados: RegistroDetalhado[] = registros.map((reg) => {
      const horas = CalculoHorasUtil.calcularHorasDoRegistro(
        reg.hora_inicio,
        reg.hora_fim,
        reg.intervalo_minutos,
        reg.horas_corrigidas ? Number(reg.horas_corrigidas) : undefined,
      )

      return {
        id: reg.id,
        colaboradorNome: reg.funcionario_nome,
        tipo: reg.tipo,
        data: reg.data.toISOString().split('T')[0],
        horaInicio: reg.hora_inicio,
        horaFim: reg.hora_fim,
        horasCalculadas: CalculoHorasUtil.formatarHorasDecimal(horas),
        observacao: reg.observacao || undefined,
      }
    })

    const detalhePorColaborador = colaboradores.map((colab) => ({
      id: colab.id,
      nome: `${colab.nome} ${colab.sobrenome}`.trim(),
      email: colab.email,
      cargo: colab.cargo,
      totalRegistros: colab.registrosBancoHoras.length,
    }))

    return {
      titulo: 'Relatório de Banco de Horas',
      dataGeracao: new Date().toISOString(),
      periodo: {
        inicio: dataInicio?.toISOString().split('T')[0] || 'sem-filtro',
        fim: dataFim?.toISOString().split('T')[0] || 'sem-filtro',
      },
      resumo: {
        totalTrabalhado: estatisticas.totalTrabalhado,
        totalAusencias: estatisticas.totalAusencias,
        totalDescontado: estatisticas.totalDescontado,
        saldoAcumulado: estatisticas.saldoAcumulado,
        totalFuncionarios: estatisticas.totalFuncionarios,
        totalRegistros: estatisticas.totalRegistros,
      },
      contasCorrentes: contas,
      registros: registrosDetalhados,
      detalhePorColaborador,
    }
  }
}
