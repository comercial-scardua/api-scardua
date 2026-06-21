import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { PrismaService } from '../../../../prisma/prisma.service'
import { CalculoHorasUtil } from '../utils/calculo-horas.util'

@Injectable()
export class GerarTermoAusenciaUseCase {
  constructor(private prisma: PrismaService) {}

  async execute(
    colaboradorId: number,
    dataInicio: string,
    dataFim: string,
    motivo?: string,
  ) {
    if (!colaboradorId || !dataInicio || !dataFim) {
      throw new BadRequestException(
        'colaboradorId, dataInicio e dataFim são obrigatórios',
      )
    }

    const colaborador = await this.prisma.colaboradores.findUnique({
      where: { id: colaboradorId },
    })

    if (!colaborador)
      throw new NotFoundException(
        `Colaborador #${colaboradorId} não encontrado`,
      )

    const registrosAusencia = await this.prisma.registros_banco_horas.findMany({
      where: {
        colaborador_id: colaboradorId,
        tipo: { in: ['SAIDA', 'AUSENCIA', 'FALTA'] },
        data: { gte: new Date(dataInicio), lte: new Date(dataFim) },
      },
      orderBy: { data: 'asc' },
    })

    const totalHorasAusencia = registrosAusencia.reduce((acc, reg) => {
      return (
        acc +
        CalculoHorasUtil.calcularHorasDoRegistro(
          reg.hora_inicio,
          reg.hora_fim,
          reg.intervalo_minutos,
          reg.horas_corrigidas ? Number(reg.horas_corrigidas) : undefined,
        )
      )
    }, 0)

    return {
      titulo: 'Termo de Ausência',
      dataGeracao: new Date().toISOString(),
      colaborador: {
        id: colaborador.id,
        nome: `${colaborador.nome} ${colaborador.sobrenome}`.trim(),
        cpf: colaborador.cpf,
        cargo: colaborador.cargo,
      },
      periodo: { inicio: dataInicio, fim: dataFim },
      motivo: motivo ?? '',
      totalAusencias: registrosAusencia.length,
      totalHorasAusencia:
        CalculoHorasUtil.formatarHorasDecimal(totalHorasAusencia),
      registros: registrosAusencia.map((reg) => ({
        id: reg.id,
        data: reg.data.toISOString().split('T')[0],
        tipo: reg.tipo,
        horas: CalculoHorasUtil.formatarHorasDecimal(
          CalculoHorasUtil.calcularHorasDoRegistro(
            reg.hora_inicio,
            reg.hora_fim,
            reg.intervalo_minutos,
            reg.horas_corrigidas ? Number(reg.horas_corrigidas) : undefined,
          ),
        ),
        observacao: reg.observacao,
      })),
    }
  }
}
