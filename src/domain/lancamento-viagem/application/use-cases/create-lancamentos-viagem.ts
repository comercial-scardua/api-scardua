import { Injectable } from '@nestjs/common'
import { type Either, right } from '../../../../core/either'
import {
  type BulkCreateViagemResult,
  type CreateLancamentoViagemBulkData,
  LancamentoViagemRepository,
} from '../repositories/lancamento-viagem-repository'

interface CreateLancamentosViagemUseCaseRequest {
  data: CreateLancamentoViagemBulkData
}

type CreateLancamentosViagemUseCaseResponse = Either<
  never,
  BulkCreateViagemResult
>

@Injectable()
export class CreateLancamentosViagemUseCase {
  constructor(private lancamentoViagemRepository: LancamentoViagemRepository) {}

  async execute({
    data,
  }: CreateLancamentosViagemUseCaseRequest): Promise<CreateLancamentosViagemUseCaseResponse> {
    const result = await this.lancamentoViagemRepository.createBulk(data)
    return right(result)
  }
}
