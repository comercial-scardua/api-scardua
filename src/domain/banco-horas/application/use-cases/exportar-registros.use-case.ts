import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../../../prisma/prisma.service'
import { CalculoHorasUtil } from '../utils/calculo-horas.util'

@Injectable()
export class ExportarRegistrosUseCase {
  constructor(private prisma: PrismaService) {}

  async execute(colaboradorId?: number, dataInicio?: string, dataFim?: string) {
    const where: any = {}

    if (colaboradorId) where.colaborador_id = colaboradorId
    if (dataInicio || dataFim) {
      where.data = {}
      if (dataInicio) where.data.gte = new Date(dataInicio)
      if (dataFim) where.data.lte = new Date(dataFim)
    }

    const registros = await this.prisma.registros_banco_horas.findMany({
      where,
      orderBy: [{ colaborador_id: 'asc' }, { data: 'desc' }],
    })

    return {
      exportadoEm: new Date().toISOString(),
      total: registros.length,
      registros: registros.map((reg) => ({
        id: reg.id,
        colaboradorId: reg.colaborador_id,
        funcionarioNome: reg.funcionario_nome,
        tipo: reg.tipo,
        data: reg.data.toISOString().split('T')[0],
        horaInicio: reg.hora_inicio,
        horaFim: reg.hora_fim,
        intervaloMinutos: reg.intervalo_minutos,
        horasCorrigidas: reg.horas_corrigidas,
        horas: CalculoHorasUtil.formatarHorasDecimal(
          CalculoHorasUtil.calcularHorasDoRegistro(
            reg.hora_inicio,
            reg.hora_fim,
            reg.intervalo_minutos,
            reg.horas_corrigidas ? Number(reg.horas_corrigidas) : undefined,
          ),
        ),
        observacao: reg.observacao,
        dataCriacao: reg.data_criacao,
      })),
    }
  }
}
