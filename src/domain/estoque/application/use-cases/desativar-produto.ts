import { Injectable } from '@nestjs/common'
import { type Either, left, right } from '../../../../core/either'
import { EstoqueRepository } from '../repositories/estoque-repository'
import { ProdutoNaoEncontradoError } from './errors/produto-nao-encontrado.error'

type DesativarResult = Either<ProdutoNaoEncontradoError, void>

@Injectable()
export class DesativarProdutoUseCase {
  constructor(private repo: EstoqueRepository) {}

  async execute(id: number): Promise<DesativarResult> {
    const existe = await this.repo.findProdutoById(id)
    if (!existe) return left(new ProdutoNaoEncontradoError(id))

    await this.repo.desativarProduto(id)
    return right(undefined)
  }
}
