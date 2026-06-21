import { Injectable } from '@nestjs/common'
import { type Either, right } from '../../../../core/either'
import {
  ImportacaoPrecosRepository,
  type ImportarPrecosData,
  type ImportarPrecosResult,
} from '../repositories/importacao-precos-repository'

type ImportarPrecosUseCaseResponse = Either<null, ImportarPrecosResult>

@Injectable()
export class ImportarPrecosUseCase {
  constructor(private repository: ImportacaoPrecosRepository) {}

  async execute(
    data: ImportarPrecosData,
  ): Promise<ImportarPrecosUseCaseResponse> {
    const result = await this.repository.importar(data)
    return right(result)
  }
}
