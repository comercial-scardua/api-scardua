import { Injectable } from '@nestjs/common'
import type { epi_movimentacoes } from '@prisma/client'
import { type Either, left, right } from '../../../../core/either'
import type { CriarMovimentacaoEpiData } from '../repositories/epi-repository'
import { EpiRepository } from '../repositories/epi-repository'
import { EstoqueInsuficienteError } from './errors/estoque-insuficiente.error'

type Result = Either<
  EstoqueInsuficienteError,
  { movimentacao: epi_movimentacoes }
>

@Injectable()
export class CriarMovimentacaoEpiUseCase {
  constructor(private repo: EpiRepository) {}

  async execute(dto: CriarMovimentacaoEpiData): Promise<Result> {
    try {
      const movimentacao = await this.repo.createMovimentacao(dto)
      return right({ movimentacao })
    } catch (e: any) {
      if (e.message?.includes('insuficiente')) {
        return left(new EstoqueInsuficienteError(0, dto.quantidade))
      }
      throw e
    }
  }
}
