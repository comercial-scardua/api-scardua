import { Injectable } from '@nestjs/common'
import { type Either, left, right } from '../../../../core/either'
import {
  type BulkCreateViagemResult,
  type CreateLancamentoViagemBulkData,
  LancamentoViagemRepository,
} from '../repositories/lancamento-viagem-repository'
import { CaixaViagemNaoEncontradaError } from './errors/caixa-viagem-nao-encontrada.error'

interface CreateLancamentosViagemForColaboradorUseCaseRequest {
  colaboradorId: number
  data: Omit<CreateLancamentoViagemBulkData, 'caixaViagemId'>
}

type CreateLancamentosViagemForColaboradorUseCaseResponse = Either<
  CaixaViagemNaoEncontradaError,
  BulkCreateViagemResult
>

@Injectable()
export class CreateLancamentosViagemForColaboradorUseCase {
  constructor(private lancamentoViagemRepository: LancamentoViagemRepository) {}

  async execute({
    colaboradorId,
    data,
  }: CreateLancamentosViagemForColaboradorUseCaseRequest): Promise<CreateLancamentosViagemForColaboradorUseCaseResponse> {
    const caixa =
      await this.lancamentoViagemRepository.findCaixaAtivaByColaboradorId(
        colaboradorId,
      )

    if (!caixa) {
      return left(new CaixaViagemNaoEncontradaError(colaboradorId))
    }

    const result = await this.lancamentoViagemRepository.createBulk({
      ...data,
      caixaViagemId: caixa.id,
    })

    return right(result)
  }
}
