import { Injectable } from '@nestjs/common'
import type { stock_transfers } from '@prisma/client'
import { type Either, left, right } from '../../../../core/either'
import { EstoqueRepository } from '../repositories/estoque-repository'
import { TransferenciaNaoEncontradaError } from './errors/transferencia-nao-encontrada.error'

type GetTransferenciaResult = Either<
  TransferenciaNaoEncontradaError,
  { transferencia: stock_transfers }
>

@Injectable()
export class GetTransferenciaUseCase {
  constructor(private repo: EstoqueRepository) {}

  async execute(id: number): Promise<GetTransferenciaResult> {
    const transferencia = await this.repo.findTransferenciaById(id)
    if (!transferencia) return left(new TransferenciaNaoEncontradaError(id))
    return right({ transferencia })
  }
}
