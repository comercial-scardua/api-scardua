import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { PrismaService } from '../../../../prisma/prisma.service'
import { CalculoHorasUtil } from '../utils/calculo-horas.util'

@Injectable()
export class GerarTermoBancoHorasUseCase {
  constructor(private prisma: PrismaService) {}

  async execute(colaboradorId: number, dataInicio?: string, dataFim?: string) {
    if (!colaboradorId)
      throw new BadRequestException('colaboradorId é obrigatório')

    const colaborador = await this.prisma.colaboradores.findUnique({
      where: { id: colaboradorId },
      select: {
        id: true,
        nome: true,
        sobrenome: true,
        cpf: true,
        cargo: true,
      },
    })

    if (!colaborador)
      throw new NotFoundException(
        `Colaborador #${colaboradorId} não encontrado`,
      )

    const where: any = { colaborador_id: colaboradorId }
    if (dataInicio || dataFim) {
      where.data = {}
      if (dataInicio) where.data.gte = new Date(dataInicio)
      if (dataFim) where.data.lte = new Date(dataFim)
    }

    const [registros, conta] = await Promise.all([
      this.prisma.registros_banco_horas.findMany({
        where,
        orderBy: { data: 'asc' },
      }),
      this.prisma.conta_corrente_horas.findUnique({
        where: { colaborador_id: colaboradorId },
      }),
    ])

    const registrosFormatados = registros.map((reg) => {
      const horas = CalculoHorasUtil.calcularHorasDoRegistro(
        reg.hora_inicio,
        reg.hora_fim,
        reg.intervalo_minutos,
        reg.horas_corrigidas ? Number(reg.horas_corrigidas) : undefined,
      )
      return {
        id: reg.id,
        data: reg.data.toISOString().split('T')[0],
        tipo: reg.tipo,
        horaInicio: reg.hora_inicio,
        horaFim: reg.hora_fim,
        horas: CalculoHorasUtil.formatarHorasDecimal(horas),
        observacao: reg.observacao,
      }
    })

    return {
      titulo: 'Termo de Banco de Horas',
      dataGeracao: new Date().toISOString(),
      colaborador: {
        id: colaborador.id,
        nome: `${colaborador.nome} ${colaborador.sobrenome}`.trim(),
        cpf: colaborador.cpf,
        cargo: colaborador.cargo,
      },
      periodo: {
        inicio: dataInicio ?? 'sem-filtro',
        fim: dataFim ?? 'sem-filtro',
      },
      saldo: conta
        ? {
            totalPositivo: CalculoHorasUtil.formatarHorasDecimal(
              Number((conta as any).total_positivo),
            ),
            totalNegativo: CalculoHorasUtil.formatarHorasDecimal(
              Number((conta as any).total_negativo),
            ),
            saldo: CalculoHorasUtil.formatarHorasDecimal(
              Number((conta as any).saldo),
            ),
          }
        : null,
      registros: registrosFormatados,
    }
  }
}
