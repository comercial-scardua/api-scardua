import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { type Either, right } from '../../../../core/either'

export interface OracleCredentialsResponse {
  host: string
  port: string
  sid: string
  configured: boolean
}

type GetOracleCredentialsUseCaseResponse = Either<
  null,
  OracleCredentialsResponse
>

@Injectable()
export class GetOracleCredentialsUseCase {
  constructor(private config: ConfigService) {}

  async execute(): Promise<GetOracleCredentialsUseCaseResponse> {
    const host = this.config.get<string>('ORACLE_HOST') || 'não configurado'
    const port = this.config.get<string>('ORACLE_PORT') || '1521'
    const sid = this.config.get<string>('ORACLE_SID') || 'não configurado'
    const configured = !!this.config.get<string>('ORACLE_HOST')

    return right({ host, port, sid, configured })
  }
}
