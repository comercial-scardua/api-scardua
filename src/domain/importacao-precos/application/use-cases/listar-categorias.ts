import { Injectable } from '@nestjs/common'
import { type Either, right } from '../../../../core/either'
import { ImportacaoPrecosRepository } from '../repositories/importacao-precos-repository'

type ListarCategoriasUseCaseResponse = Either<null, (string | null)[]>

@Injectable()
export class ListarCategoriasUseCase {
  constructor(private repository: ImportacaoPrecosRepository) {}

  async execute(): Promise<ListarCategoriasUseCaseResponse> {
    const result = await this.repository.categorias()
    return right(result)
  }
}
