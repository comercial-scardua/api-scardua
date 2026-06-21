import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { PrismaService } from '../../../../prisma/prisma.service'
import { CalculoHorasUtil } from '../utils/calculo-horas.util'

@Injectable()
export class GerarTermosRegistrosUseCase {
  constructor(private prisma: PrismaService) {}

  async execute(registroIds: number[]) {
    if (!registroIds?.length)
      throw new BadRequestException(
        'registroIds é obrigatório e não pode estar vazio',
      )

    const registros = await this.prisma.registros_banco_horas.findMany({
      where: { id: { in: registroIds } },
      orderBy: [{ colaborador_id: 'asc' }, { data: 'asc' }],
    })

    if (!registros.length)
      throw new NotFoundException('Nenhum registro encontrado')

    const colaboradorIds = [...new Set(registros.map((r) => r.colaborador_id))]
    const colaboradores = await this.prisma.colaboradores.findMany({
      where: { id: { in: colaboradorIds } },
      select: {
        id: true,
        nome: true,
        sobrenome: true,
        cpf: true,
        cargo: true,
      },
    })

    const colaboradoresMap = new Map(colaboradores.map((c) => [c.id, c]))

    const termos = colaboradorIds.map((colabId) => {
      const colab = colaboradoresMap.get(colabId)!
      const regsColab = registros.filter((r) => r.colaborador_id === colabId)

      return {
        colaborador: {
          id: colab.id,
          nome: `${colab.nome} ${colab.sobrenome}`.trim(),
          cpf: colab.cpf,
          cargo: colab.cargo,
        },
        registros: regsColab.map((reg) => ({
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
    })

    return {
      dataGeracao: new Date().toISOString(),
      totalTermos: termos.length,
      termos,
    }
  }
}
