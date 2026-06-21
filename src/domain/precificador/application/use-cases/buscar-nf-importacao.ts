import { Injectable } from '@nestjs/common'
import { type Either, right } from '../../../../core/either'
import { PrecificadorRepository } from '../repositories/precificador-repository'

type BuscarNfImportacaoResponse = Either<never, any[]>

@Injectable()
export class BuscarNfImportacaoUseCase {
  constructor(private repo: PrecificadorRepository) {}

  async execute(nf?: string): Promise<BuscarNfImportacaoResponse> {
    const result = await this.repo.buscarNfImportacao(nf)
    return right(result)
  }
}
