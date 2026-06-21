import { Injectable } from '@nestjs/common'
import { OracleBridgeService } from '../../../../common/oracle-bridge/oracle-bridge.service'
import { type Either, right } from '../../../../core/either'

export interface TestOracleConnectionResponse {
  status: string
  message: string
  results?: unknown
}

type TestOracleConnectionUseCaseResponse = Either<
  null,
  TestOracleConnectionResponse
>

@Injectable()
export class TestOracleConnectionUseCase {
  constructor(private oracleBridge: OracleBridgeService) {}

  async execute(): Promise<TestOracleConnectionUseCaseResponse> {
    try {
      const result = await this.oracleBridge.query('SELECT 1 FROM DUAL', [])
      if (result.success) {
        return right({
          status: 'connected',
          message: 'Conexão Oracle funcionando corretamente',
          results: result.results,
        })
      }
      return right({
        status: 'error',
        message: result.message || 'Falha na conexão Oracle',
      })
    } catch {
      return right({
        status: 'not_configured',
        message: 'Oracle Bridge não disponível',
      })
    }
  }
}
