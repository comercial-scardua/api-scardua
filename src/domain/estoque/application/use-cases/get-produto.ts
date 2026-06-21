import { Injectable } from '@nestjs/common'
import type { products } from '@prisma/client'
import { type Either, left, right } from '../../../../core/either'
import { EstoqueRepository } from '../repositories/estoque-repository'
import { ProdutoNaoEncontradoError } from './errors/produto-nao-encontrado.error'

type GetProdutoResult = Either<ProdutoNaoEncontradoError, { produto: products }>

@Injectable()
export class GetProdutoUseCase {
  constructor(private repo: EstoqueRepository) {}

  async execute(id: number): Promise<GetProdutoResult> {
    const produto = await this.repo.findProdutoById(id)
    if (!produto) return left(new ProdutoNaoEncontradoError(id))
    return right({ produto })
  }
}
