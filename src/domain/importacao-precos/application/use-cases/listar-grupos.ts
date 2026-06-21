import { Injectable } from '@nestjs/common'
import { type Either, right } from '../../../../core/either'
import { ImportacaoPrecosRepository } from '../repositories/importacao-precos-repository'

type ListarGruposUseCaseResponse = Either<null, string[]>

@Injectable()
export class ListarGruposUseCase {
  constructor(private repository: ImportacaoPrecosRepository) {}

  async execute(): Promise<ListarGruposUseCaseResponse> {
    const result = await this.repository.grupos()
    return right(result)
  }
}
