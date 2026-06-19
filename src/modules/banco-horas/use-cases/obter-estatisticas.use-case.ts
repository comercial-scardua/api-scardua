import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../../prisma/prisma.service'
import { CalculoHorasUtil } from '../utils/calculo-horas.util'

interface Estatisticas {
  totalTrabalhado: number
  totalAusencias: number
  totalDescontado: number
  saldoAcumulado: number
  totalFuncionarios: number
  totalRegistros: number
  periodo: {
    inicio: string
    fim: string
  }
}

@Injectable()
export class ObterEstatisticasUseCase {
  constructor(private prisma: PrismaService) {}

  async execute(
    dataInicio?: Date,
    dataFim?: Date,
    colaboradorId?: number,
  ): Promise<Estatisticas> {
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
    })

    let totalTrabalhado = 0
    let totalAusencias = 0
    let totalDescontado = 0
    const funcionarios = new Set<number>()

    registros.forEach((reg) => {
      funcionarios.add(reg.colaborador_id)
      const horas = CalculoHorasUtil.calcularHorasDoRegistro(
        reg.hora_inicio,
        reg.hora_fim,
        reg.intervalo_minutos,
        reg.horas_corrigidas ? Number(reg.horas_corrigidas) : undefined,
      )

      if (reg.tipo === 'ENTRADA' || reg.tipo === 'TRABALHO') {
        totalTrabalhado += horas
      } else if (reg.tipo === 'SAIDA' || reg.tipo === 'AUSENCIA') {
        totalAusencias += Math.abs(horas)
      } else if (reg.tipo === 'PAGAMENTO') {
        totalDescontado += Math.abs(horas)
      }
    })

    return {
      totalTrabalhado: Number(totalTrabalhado.toFixed(2)),
      totalAusencias: Number(totalAusencias.toFixed(2)),
      totalDescontado: Number(totalDescontado.toFixed(2)),
      saldoAcumulado: Number(
        (totalTrabalhado - totalAusencias - totalDescontado).toFixed(2),
      ),
      totalFuncionarios: funcionarios.size,
      totalRegistros: registros.length,
      periodo: {
        inicio: dataInicio?.toISOString().split('T')[0] || 'sem-filtro',
        fim: dataFim?.toISOString().split('T')[0] || 'sem-filtro',
      },
    }
  }
}
