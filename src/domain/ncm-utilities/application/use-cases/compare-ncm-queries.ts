import { Injectable } from '@nestjs/common'
import { type Either, right } from '../../../../core/either'

interface CompareNcmQueriesRequest {
  query1?: string
  query2?: string
}

export interface CompareNcmQueriesResult {
  message: string
  query1: string | null
  query2: string | null
}

type CompareNcmQueriesResponse = Either<never, CompareNcmQueriesResult>

@Injectable()
export class CompareNcmQueriesUseCase {
  async execute(
    request: CompareNcmQueriesRequest,
  ): Promise<CompareNcmQueriesResponse> {
    return right({
      message: 'Comparacao via Oracle nao disponivel',
      query1: request.query1 ?? null,
      query2: request.query2 ?? null,
    })
  }
}
