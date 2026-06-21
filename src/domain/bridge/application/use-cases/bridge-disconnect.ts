import { Injectable } from '@nestjs/common'
import { type Either, right } from '../../../../core/either'

type BridgeDisconnectResponse = Either<null, { status: string; message: string }>

@Injectable()
export class BridgeDisconnectUseCase {
  async execute(): Promise<BridgeDisconnectResponse> {
    return right({ status: 'disconnected', message: 'Sessão Bridge encerrada' })
  }
}
