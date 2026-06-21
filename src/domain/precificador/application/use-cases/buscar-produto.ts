import { Injectable } from '@nestjs/common'
import { type Either, right } from '../../../../core/either'
import { PrecificadorRepository } from '../repositories/precificador-repository'

type BuscarProdutoResponse = Either<never, any[]>

@Injectable()
export class BuscarProdutoUseCase {
  constructor(private repo: PrecificadorRepository) {}

  async execute(q?: string, codigo?: string): Promise<BuscarProdutoResponse> {
    const result = await this.repo.buscarProduto(q, codigo)
    return right(result)
  }
}
