import { Injectable } from '@nestjs/common'
import { type Either, right } from '../../../../core/either'
import { OracleBridgeService } from '../../../../common/oracle-bridge/oracle-bridge.service'

type OracleQueryExecuteResponse = Either<null, any>

@Injectable()
export class OracleQueryExecuteUseCase {
  constructor(private oracleBridge: OracleBridgeService) {}

  async execute(sql: string, params: unknown[]): Promise<OracleQueryExecuteResponse> {
    const result = await this.oracleBridge.query(sql, params)
    return right(result)
  }
}
