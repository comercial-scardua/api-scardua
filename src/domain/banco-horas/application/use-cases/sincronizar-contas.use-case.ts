import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../../../prisma/prisma.service'
import { CalculoHorasUtil } from '../utils/calculo-horas.util'

@Injectable()
export class SincronizarContasUseCase {
  constructor(private prisma: PrismaService) {}

  async execute() {
    const colaboradores = await this.prisma.colaboradores.findMany({
      where: { oculto: false },
      select: {
        id: true,
        nome: true,
        sobrenome: true,
        registrosBancoHoras: true,
      },
    })

    let sincronizados = 0
    const erros: string[] = []

    for (const colaborador of colaboradores) {
      try {
        let totalPositivo = 0
        let totalNegativo = 0

        for (const reg of colaborador.registrosBancoHoras) {
          const horas = CalculoHorasUtil.calcularHorasDoRegistro(
            reg.hora_inicio,
            reg.hora_fim,
            reg.intervalo_minutos,
            reg.horas_corrigidas ? Number(reg.horas_corrigidas) : undefined,
          )

          if (reg.tipo === 'ENTRADA' || reg.tipo === 'TRABALHO') {
            totalPositivo += horas
          } else if (
            ['SAIDA', 'AUSENCIA', 'FALTA', 'PAGAMENTO'].includes(reg.tipo)
          ) {
            totalNegativo += Math.abs(horas)
          }
        }

        const saldo = totalPositivo - totalNegativo
        const nome = `${colaborador.nome} ${colaborador.sobrenome}`.trim()

        await this.prisma.conta_corrente_horas.upsert({
          where: { colaborador_id: colaborador.id },
          create: {
            colaborador_id: colaborador.id,
            funcionario_nome: nome,
            total_positivo: totalPositivo,
            total_negativo: totalNegativo,
            saldo,
          },
          update: {
            funcionario_nome: nome,
            total_positivo: totalPositivo,
            total_negativo: totalNegativo,
            saldo,
          },
        })

        sincronizados++
      } catch (e) {
        erros.push(`Colaborador #${colaborador.id}: ${(e as Error).message}`)
      }
    }

    return {
      sincronizados,
      total: colaboradores.length,
      erros,
      finalizadoEm: new Date().toISOString(),
    }
  }
}
