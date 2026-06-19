import { Injectable } from '@nestjs/common'
import type { stock_exits } from '@prisma/client'
import { type Either, left, right } from '../../../core/either'
import type { CriarSaidaDto } from '../dto/criar-saida.dto'
import { EstoqueRepository } from '../repositories/estoque.repository'
import { ProdutoNaoEncontradoError } from './errors/produto-nao-encontrado.error'
import { SaldoInsuficienteError } from './errors/saldo-insuficiente.error'

type CriarSaidaResult = Either<
  ProdutoNaoEncontradoError | SaldoInsuficienteError,
  { saida: stock_exits }
>

@Injectable()
export class CriarSaidaUseCase {
  constructor(private repo: EstoqueRepository) {}

  async execute(dto: CriarSaidaDto, userId: string): Promise<CriarSaidaResult> {
    const produto = await this.repo.findProdutoById(dto.produtoId)
    if (!produto) return left(new ProdutoNaoEncontradoError(dto.produtoId))

    // Valida saldo antes de criar — regra crítica do portal
    if (produto.estoqueAtual < dto.quantidade) {
      return left(
        new SaldoInsuficienteError(produto.estoqueAtual, dto.quantidade),
      )
    }

    const saida = await this.repo.criarSaida(dto, userId)
    return right({ saida })
  }
}
