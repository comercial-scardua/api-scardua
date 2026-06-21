import { Injectable } from '@nestjs/common'
import { type Either, right } from '../../../../core/either'
import { OracleBridgeService } from '../../../../common/oracle-bridge/oracle-bridge.service'

type OracleQueryConnectResponse = Either<null, { status: string; message: string; body?: Record<string, unknown> }>

@Injectable()
export class OracleQueryConnectUseCase {
  constructor(private oracleBridge: OracleBridgeService) {}

  async execute(body: Record<string, unknown>): Promise<OracleQueryConnectResponse> {
    try {
      const result = await this.oracleBridge.query('SELECT 1 FROM DUAL', [])
      if (result.success) {
        return right({
          status: 'connected',
          message: 'Conexão com Oracle estabelecida',
          body,
        })
      }
      return right({ status: 'error', message: result.message || 'Falha na conexão' })
    } catch {
      return right({ status: 'error', message: 'Não foi possível conectar ao Oracle' })
    }
  }
}
