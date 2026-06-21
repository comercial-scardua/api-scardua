import { Injectable } from '@nestjs/common'
import type { stock_transfers } from '@prisma/client'
import { type Either, left, right } from '../../../../core/either'
import { EstoqueRepository } from '../repositories/estoque-repository'
import { TransferenciaNaoEncontradaError } from './errors/transferencia-nao-encontrada.error'

type UpdateTransferenciaResult = Either<
  TransferenciaNaoEncontradaError,
  { transferencia: stock_transfers }
>

@Injectable()
export class UpdateTransferenciaUseCase {
  constructor(private repo: EstoqueRepository) {}

  async execute(
    id: number,
    data: Record<string, unknown>,
  ): Promise<UpdateTransferenciaResult> {
    const existe = await this.repo.findTransferenciaById(id)
    if (!existe) return left(new TransferenciaNaoEncontradaError(id))

    const transferencia = await this.repo.updateTransferencia(id, data)
    return right({ transferencia })
  }
}
