import { Injectable } from '@nestjs/common'
import { type Either, left, right } from '../../../../core/either'
import type {
  CriarTransferenciaEpiData,
  TransferenciaComDetalhes,
} from '../repositories/epi-repository'
import { EpiRepository } from '../repositories/epi-repository'
import { EstoqueInsuficienteError } from './errors/estoque-insuficiente.error'

type Result = Either<
  EstoqueInsuficienteError,
  { transferencia: TransferenciaComDetalhes }
>

@Injectable()
export class CriarTransferenciaEpiUseCase {
  constructor(private repo: EpiRepository) {}

  async execute(dto: CriarTransferenciaEpiData): Promise<Result> {
    try {
      const transferencia = await this.repo.createTransferencia(dto)
      return right({ transferencia })
    } catch (e: any) {
      if (e.message?.includes('insuficiente')) {
        return left(new EstoqueInsuficienteError(0, dto.quantidade))
      }
      throw e
    }
  }
}
