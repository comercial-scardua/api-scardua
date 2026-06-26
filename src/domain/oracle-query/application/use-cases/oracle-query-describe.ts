import { Injectable } from '@nestjs/common'
import { OracleBridgeService } from '../../../../common/oracle-bridge/oracle-bridge.service'
import { type Either, right } from '../../../../core/either'

type OracleQueryDescribeResponse = Either<null, any>

@Injectable()
export class OracleQueryDescribeUseCase {
  constructor(private oracleBridge: OracleBridgeService) {}

  async execute(tableName: string): Promise<OracleQueryDescribeResponse> {
    const sql = `SELECT column_name, data_type, data_length, nullable FROM all_tab_columns WHERE table_name = :1 ORDER BY column_id`
    const result = await this.oracleBridge.query(sql, [tableName.toUpperCase()])
    return right(result)
  }
}
