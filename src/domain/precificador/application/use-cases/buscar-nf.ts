import { Injectable } from '@nestjs/common'
import { type Either, right } from '../../../../core/either'
import { PrecificadorRepository } from '../repositories/precificador-repository'

type BuscarNfResponse = Either<never, any[]>

@Injectable()
export class BuscarNfUseCase {
  constructor(private repo: PrecificadorRepository) {}

  async execute(nf?: string, fornecedor?: string): Promise<BuscarNfResponse> {
    const result = await this.repo.buscarNf(nf, fornecedor)
    return right(result)
  }
}
