import { Injectable } from '@nestjs/common'
import { type Either, right } from '../../../../core/either'

type OracleQueryDisconnectResponse = Either<null, { status: string; message: string }>

@Injectable()
export class OracleQueryDisconnectUseCase {
  async execute(): Promise<OracleQueryDisconnectResponse> {
    return right({ status: 'disconnected', message: 'Sessão Oracle encerrada' })
  }
}
