import { Injectable } from '@nestjs/common'
import { type Either, right } from '../../../../core/either'
import { PrismaService } from '../../../../prisma/prisma.service'

type TestSyncHorasResponse = Either<null, {
  registros_banco_horas: { total: number }
  conta_corrente_horas: { total: number }
  distribuicaoPorTipo: { tipo: string; quantidade: number }[]
}>

@Injectable()
export class TestSyncHorasUseCase {
  constructor(private prisma: PrismaService) {}

  async execute(): Promise<TestSyncHorasResponse> {
    const [totalRegistros, totalContas] = await Promise.all([
      this.prisma.registros_banco_horas.count(),
      this.prisma.conta_corrente_horas.count(),
    ])

    const porTipo = await this.prisma.registros_banco_horas.groupBy({
      by: ['tipo'],
      _count: { id: true },
    })

    return right({
      registros_banco_horas: { total: totalRegistros },
      conta_corrente_horas: { total: totalContas },
      distribuicaoPorTipo: porTipo.map((t) => ({
        tipo: t.tipo,
        quantidade: t._count.id,
      })),
    })
  }
}
