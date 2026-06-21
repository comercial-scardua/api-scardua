import { Injectable } from '@nestjs/common'
import { type Either, right } from '../../../../core/either'
import { OracleBridgeService } from '../../../../common/oracle-bridge/oracle-bridge.service'

type BridgeExecuteResponse = Either<null, any>

@Injectable()
export class BridgeExecuteUseCase {
  constructor(private oracleBridge: OracleBridgeService) {}

  async execute(sql: string, params: unknown[]): Promise<BridgeExecuteResponse> {
    const result = await this.oracleBridge.query(sql, params)
    return right(result)
  }
}
