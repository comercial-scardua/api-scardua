import { Injectable } from '@nestjs/common'
import type { lancamentos } from '@prisma/client'
import { type Either, left, right } from '../../../../core/either'
import {
  ContaCorrenteRepository,
  type CreateLancamentoData,
} from '../repositories/conta-corrente-repository'
import { ContaNaoEncontradaError } from './errors/conta-nao-encontrada.error'

interface CriarLancamentoContaUseCaseRequest {
  contaId: number
  data: CreateLancamentoData
}

type CriarLancamentoContaUseCaseResponse = Either<
  ContaNaoEncontradaError,
  { lancamento: lancamentos }
>

@Injectable()
export class CriarLancamentoContaUseCase {
  constructor(private contaCorrenteRepository: ContaCorrenteRepository) {}

  async execute({
    contaId,
    data,
  }: CriarLancamentoContaUseCaseRequest): Promise<CriarLancamentoContaUseCaseResponse> {
    const existe = await this.contaCorrenteRepository.findById(contaId)
    if (!existe) return left(new ContaNaoEncontradaError(contaId))

    const lancamento = await this.contaCorrenteRepository.criarLancamento(
      contaId,
      data,
    )
    return right({ lancamento })
  }
}
