import { Injectable } from '@nestjs/common'
import { type Either, right } from '../../../../core/either'

export interface GetStatusResponse {
  status: string
  timestamp: string
  version: string
}

type GetStatusUseCaseResponse = Either<null, GetStatusResponse>

@Injectable()
export class GetStatusUseCase {
  async execute(): Promise<GetStatusUseCaseResponse> {
    return right({
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    })
  }
}
