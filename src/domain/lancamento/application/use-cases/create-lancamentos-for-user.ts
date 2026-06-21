import { Injectable } from '@nestjs/common'
import { type Either, left, right } from '../../../../core/either'
import {
  type BulkCreateResult,
  type CreateLancamentoBulkData,
  LancamentoRepository,
} from '../repositories/lancamento-repository'
import { ContaCorrenteNaoEncontradaError } from './errors/conta-corrente-nao-encontrada.error'

interface CreateLancamentosForUserUseCaseRequest {
  colaboradorId: number
  data: Omit<CreateLancamentoBulkData, 'contaCorrenteId'>
}

type CreateLancamentosForUserUseCaseResponse = Either<
  ContaCorrenteNaoEncontradaError,
  BulkCreateResult
>

@Injectable()
export class CreateLancamentosForUserUseCase {
  constructor(private lancamentoRepository: LancamentoRepository) {}

  async execute({
    colaboradorId,
    data,
  }: CreateLancamentosForUserUseCaseRequest): Promise<CreateLancamentosForUserUseCaseResponse> {
    const conta =
      await this.lancamentoRepository.findContaByColaboradorId(colaboradorId)

    if (!conta) {
      return left(new ContaCorrenteNaoEncontradaError(colaboradorId))
    }

    const result = await this.lancamentoRepository.createBulk({
      ...data,
      contaCorrenteId: conta.id,
    })

    return right(result)
  }
}
