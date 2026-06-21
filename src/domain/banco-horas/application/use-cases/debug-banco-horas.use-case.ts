import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../../../prisma/prisma.service'

@Injectable()
export class DebugBancoHorasUseCase {
  constructor(private prisma: PrismaService) {}

  async execute() {
    const [registros, contas, colaboradores] = await Promise.all([
      this.prisma.registros_banco_horas.count(),
      this.prisma.conta_corrente_horas.count(),
      this.prisma.colaboradores.count({ where: { oculto: false } }),
    ])

    const registrosSemHoras = await this.prisma.registros_banco_horas.count({
      where: { hora_inicio: null, hora_fim: null, horas_corrigidas: null },
    })

    const tiposContagem = await this.prisma.registros_banco_horas.groupBy({
      by: ['tipo'],
      _count: { id: true },
    })

    return {
      diagnostico: {
        totalRegistros: registros,
        totalContasCorrentes: contas,
        totalColaboradoresAtivos: colaboradores,
        registrosSemHoras,
        tiposPorContagem: tiposContagem.map((t) => ({
          tipo: t.tipo,
          total: t._count.id,
        })),
      },
      status: 'ok',
      timestamp: new Date().toISOString(),
    }
  }
}
