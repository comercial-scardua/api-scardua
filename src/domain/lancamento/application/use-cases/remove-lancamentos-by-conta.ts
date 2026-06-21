import { Injectable } from '@nestjs/common'
import { type Either, right } from '../../../../core/either'
import {
  LancamentoRepository,
  type RemoveByContaResult,
} from '../repositories/lancamento-repository'

interface RemoveLancamentosByContaUseCaseRequest {
  contaCorrenteId: number
}

type RemoveLancamentosByContaUseCaseResponse = Either<
  never,
  RemoveByContaResult
>

@Injectable()
export class RemoveLancamentosByContaUseCase {
  constructor(private lancamentoRepository: LancamentoRepository) {}

  async execute({
    contaCorrenteId,
  }: RemoveLancamentosByContaUseCaseRequest): Promise<RemoveLancamentosByContaUseCaseResponse> {
    const result =
      await this.lancamentoRepository.removeByContaCorrenteId(contaCorrenteId)
    return right(result)
  }
}
