import { Injectable } from '@nestjs/common'
import { type Either, right } from '../../../../core/either'
import { OracleBridgeService } from '../../../../common/oracle-bridge/oracle-bridge.service'

type OracleQueryTablesResponse = Either<null, any>

@Injectable()
export class OracleQueryTablesUseCase {
  constructor(private oracleBridge: OracleBridgeService) {}

  async execute(): Promise<OracleQueryTablesResponse> {
    const sql = `SELECT table_name, num_rows FROM user_tables ORDER BY table_name`
    const result = await this.oracleBridge.query(sql, [])
    return right(result)
  }
}
