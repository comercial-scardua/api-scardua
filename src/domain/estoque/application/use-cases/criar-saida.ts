import { Injectable } from '@nestjs/common'
import type { stock_exits } from '@prisma/client'
import { type Either, left, right } from '../../../../core/either'
import {
  type CriarSaidaData,
  EstoqueRepository,
} from '../repositories/estoque-repository'
import { ProdutoNaoEncontradoError } from './errors/produto-nao-encontrado.error'
import { SaldoInsuficienteError } from './errors/saldo-insuficiente.error'

type CriarSaidaResult = Either<
  ProdutoNaoEncontradoError | SaldoInsuficienteError,
  { saida: stock_exits }
>

@Injectable()
export class CriarSaidaUseCase {
  constructor(private repo: EstoqueRepository) {}

  async execute(
    dto: CriarSaidaData,
    userId: string,
  ): Promise<CriarSaidaResult> {
    const produto = await this.repo.findProdutoById(dto.produtoId)
    if (!produto) return left(new ProdutoNaoEncontradoError(dto.produtoId))

    if (produto.estoqueAtual < dto.quantidade) {
      return left(
        new SaldoInsuficienteError(produto.estoqueAtual, dto.quantidade),
      )
    }

    const saida = await this.repo.criarSaida(dto, userId)
    return right({ saida })
  }
}
