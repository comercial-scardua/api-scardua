import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../../../prisma/prisma.service'

@Injectable()
export class StatusSincronizacaoUseCase {
  constructor(private prisma: PrismaService) {}

  async execute() {
    const [totalRegistros, totalContas, totalColaboradores] = await Promise.all(
      [
        this.prisma.registros_banco_horas.count(),
        this.prisma.conta_corrente_horas.count(),
        this.prisma.colaboradores.count({ where: { oculto: false } }),
      ],
    )

    return {
      totalRegistros,
      totalContas,
      totalColaboradoresAtivos: totalColaboradores,
      contasSemSincronizar: totalColaboradores - totalContas,
      ultimaVerificacao: new Date().toISOString(),
    }
  }
}
