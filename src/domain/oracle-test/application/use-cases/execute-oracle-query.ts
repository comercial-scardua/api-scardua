import { Injectable } from '@nestjs/common'
import { OracleBridgeService } from '../../../../common/oracle-bridge/oracle-bridge.service'
import { type Either, right } from '../../../../core/either'

interface ExecuteOracleQueryRequest {
  sql?: string
  params?: unknown[]
}

type ExecuteOracleQueryUseCaseResponse = Either<null, Record<string, unknown>>

@Injectable()
export class ExecuteOracleQueryUseCase {
  constructor(private oracleBridge: OracleBridgeService) {}

  async execute({
    sql,
    params,
  }: ExecuteOracleQueryRequest): Promise<ExecuteOracleQueryUseCaseResponse> {
    const effectiveSql = sql || 'SELECT SYSDATE AS data_atual FROM DUAL'
    try {
      const result = await this.oracleBridge.query(effectiveSql, params ?? [])
      return right({
        sql: effectiveSql,
        ...result,
      })
    } catch {
      return right({
        status: 'not_configured',
        message: 'Oracle Bridge não disponível',
        sql: effectiveSql,
      })
    }
  }
}
