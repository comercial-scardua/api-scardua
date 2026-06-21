import { Injectable } from '@nestjs/common'
import type { products } from '@prisma/client'
import { type Either, left, right } from '../../../../core/either'
import {
  type CriarProdutoData,
  EstoqueRepository,
} from '../repositories/estoque-repository'
import { ProdutoNaoEncontradoError } from './errors/produto-nao-encontrado.error'

type AtualizarResult = Either<ProdutoNaoEncontradoError, { produto: products }>

@Injectable()
export class AtualizarProdutoUseCase {
  constructor(private repo: EstoqueRepository) {}

  async execute(
    id: number,
    dto: Partial<CriarProdutoData>,
  ): Promise<AtualizarResult> {
    const existe = await this.repo.findProdutoById(id)
    if (!existe) return left(new ProdutoNaoEncontradoError(id))

    const produto = await this.repo.atualizarProduto(id, dto)
    return right({ produto })
  }
}
