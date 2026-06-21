import { Injectable } from '@nestjs/common'
import { type Either, right } from '../../../../core/either'
import { PrecificadorRepository } from '../repositories/precificador-repository'

type BuscarFornecedorResponse = Either<never, any[]>

@Injectable()
export class BuscarFornecedorUseCase {
  constructor(private repo: PrecificadorRepository) {}

  async execute(fornecedor?: string): Promise<BuscarFornecedorResponse> {
    const result = await this.repo.buscarFornecedor(fornecedor)
    return right(result)
  }
}
