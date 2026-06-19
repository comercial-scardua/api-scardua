import { Injectable } from '@nestjs/common'
import type { movimentacoes } from '@prisma/client'
import { type Either, right } from '../../../../core/either'
import {
  type CreateMovimentacaoData,
  MovimentacaoRepository,
} from '../repositories/movimentacao-repository'

interface CreateMovimentacaoUseCaseRequest {
  data: CreateMovimentacaoData
  autorId?: number
}

type CreateMovimentacaoUseCaseResponse = Either<
  null,
  { movimentacao: movimentacoes }
>

@Injectable()
export class CreateMovimentacaoUseCase {
  constructor(private movimentacaoRepository: MovimentacaoRepository) {}

  async execute({
    data,
    autorId,
  }: CreateMovimentacaoUseCaseRequest): Promise<CreateMovimentacaoUseCaseResponse> {
    const movimentacao = await this.movimentacaoRepository.create(data, autorId)
    return right({ movimentacao })
  }
}
