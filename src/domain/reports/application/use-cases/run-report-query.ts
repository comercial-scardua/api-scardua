import { Injectable } from '@nestjs/common'
import { type Either, right } from '../../../../core/either'
import { PrismaService } from '../../../../prisma/prisma.service'

interface RunReportQueryRequest {
  relatorioId?: number | null
  sql?: string | null
  parametros?: Record<string, unknown> | null
}

export interface RunReportQueryResponse {
  sql: string | null
  parametros: Record<string, unknown> | null
  message: string
  relatorio: {
    id: number
    nome: string
    query_sql: string
    banco_dados: string
    departamento: string
    descricao: string | null
  } | null
}

type RunReportQueryUseCaseResponse = Either<null, RunReportQueryResponse>

@Injectable()
export class RunReportQueryUseCase {
  constructor(private prisma: PrismaService) {}

  async execute({
    relatorioId,
    sql,
    parametros,
  }: RunReportQueryRequest): Promise<RunReportQueryUseCaseResponse> {
    let relatorio: RunReportQueryResponse['relatorio'] = null

    if (relatorioId !== undefined && relatorioId !== null) {
      relatorio = await this.prisma.relatorios.findUnique({
        where: { id: relatorioId },
        select: {
          id: true,
          nome: true,
          query_sql: true,
          banco_dados: true,
          departamento: true,
          descricao: true,
        },
      })
    }

    const effectiveSql = relatorio?.query_sql ?? sql ?? null

    return right({
      sql: effectiveSql,
      parametros: parametros ?? null,
      message: 'Execute via Oracle bridge',
      relatorio,
    })
  }
}
