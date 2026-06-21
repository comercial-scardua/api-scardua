import { Injectable } from '@nestjs/common'
import { type Either, right } from '../../../../core/either'
import {
  type BulkCreateResult,
  type CreateLancamentoBulkData,
  LancamentoRepository,
} from '../repositories/lancamento-repository'

interface CreateLancamentosUseCaseRequest {
  data: CreateLancamentoBulkData
}

type CreateLancamentosUseCaseResponse = Either<never, BulkCreateResult>

@Injectable()
export class CreateLancamentosUseCase {
  constructor(private lancamentoRepository: LancamentoRepository) {}

  async execute({
    data,
  }: CreateLancamentosUseCaseRequest): Promise<CreateLancamentosUseCaseResponse> {
    const result = await this.lancamentoRepository.createBulk(data)
    return right(result)
  }
}
