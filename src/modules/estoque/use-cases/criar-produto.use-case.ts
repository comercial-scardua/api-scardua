import { Injectable } from '@nestjs/common';
import type { products } from '@prisma/client';
import { type Either, left, right } from '../../../core/either';
import type { CriarProdutoDto } from '../dto/criar-produto.dto';
import { EstoqueRepository } from '../repositories/estoque.repository';
import { CodigoJaCadastradoError } from './errors/codigo-ja-cadastrado.error';

type CriarProdutoResult = Either<CodigoJaCadastradoError, { produto: products }>;

@Injectable()
export class CriarProdutoUseCase {
  constructor(private repo: EstoqueRepository) {}

  async execute(dto: CriarProdutoDto, userId: string): Promise<CriarProdutoResult> {
    const existente = await this.repo.findProdutoByCodigo(dto.codigoInterno);
    if (existente) return left(new CodigoJaCadastradoError(dto.codigoInterno));

    const produto = await this.repo.criarProduto(dto, userId);
    return right({ produto });
  }
}
