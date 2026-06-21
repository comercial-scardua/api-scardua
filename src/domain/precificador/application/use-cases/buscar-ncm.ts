import { Injectable } from '@nestjs/common'
import { type Either, right } from '../../../../core/either'
import { PrecificadorRepository } from '../repositories/precificador-repository'

type BuscarNcmPrecificadorResponse = Either<never, any[]>

@Injectable()
export class BuscarNcmPrecificadorUseCase {
  constructor(private repo: PrecificadorRepository) {}

  async execute(ncm?: string): Promise<BuscarNcmPrecificadorResponse> {
    const result = await this.repo.buscarNcm(ncm)
    return right(result)
  }
}
