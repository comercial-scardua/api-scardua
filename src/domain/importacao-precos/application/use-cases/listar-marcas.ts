import { Injectable } from '@nestjs/common'
import { type Either, right } from '../../../../core/either'
import { ImportacaoPrecosRepository } from '../repositories/importacao-precos-repository'

type ListarMarcasUseCaseResponse = Either<null, string[]>

@Injectable()
export class ListarMarcasUseCase {
  constructor(private repository: ImportacaoPrecosRepository) {}

  async execute(): Promise<ListarMarcasUseCaseResponse> {
    const result = await this.repository.marcas()
    return right(result)
  }
}
