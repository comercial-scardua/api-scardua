import { Injectable } from '@nestjs/common'
import type { stock_transfers } from '@prisma/client'
import { type Either, left, right } from '../../../../core/either'
import {
  type CriarTransferenciaData,
  EstoqueRepository,
} from '../repositories/estoque-repository'
import { ProdutoNaoEncontradoError } from './errors/produto-nao-encontrado.error'
import { SaldoInsuficienteError } from './errors/saldo-insuficiente.error'

type CriarTransferenciaResult = Either<
  ProdutoNaoEncontradoError | SaldoInsuficienteError,
  { transferencia: stock_transfers }
>

@Injectable()
export class CriarTransferenciaUseCase {
  constructor(private repo: EstoqueRepository) {}

  async execute(
    dto: CriarTransferenciaData,
    userId: string,
  ): Promise<CriarTransferenciaResult> {
    const produto = await this.repo.findProdutoById(dto.produtoId)
    if (!produto) return left(new ProdutoNaoEncontradoError(dto.produtoId))

    const saldoOrigem = await this.repo.saldoProdutoNaFilial(
      dto.produtoId,
      dto.empresaOrigemId,
    )
    if (saldoOrigem < dto.quantidade) {
      return left(new SaldoInsuficienteError(saldoOrigem, dto.quantidade))
    }

    const transferencia = await this.repo.criarTransferencia(dto, userId)
    return right({ transferencia })
  }
}
