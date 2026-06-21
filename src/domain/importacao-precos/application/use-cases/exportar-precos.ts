import { Injectable } from '@nestjs/common'
import { type Either, right } from '../../../../core/either'
import { ImportacaoPrecosRepository } from '../repositories/importacao-precos-repository'

type ExportarPrecosUseCaseResponse = Either<null, any[]>

@Injectable()
export class ExportarPrecosUseCase {
  constructor(private repository: ImportacaoPrecosRepository) {}

  async execute(
    categoria?: string,
    grupo?: string,
    marca?: string,
  ): Promise<ExportarPrecosUseCaseResponse> {
    const result = await this.repository.exportar(categoria, grupo, marca)
    return right(result)
  }
}
