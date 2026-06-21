import { Injectable } from '@nestjs/common'
import { type Either, right } from '../../../../core/either'
import { PrecificadorRepository } from '../repositories/precificador-repository'

type ListarHistoricoResponse = Either<never, any>

@Injectable()
export class ListarHistoricoUseCase {
  constructor(private repo: PrecificadorRepository) {}

  async execute(
    produtoId?: number,
    page?: number,
    limit?: number,
  ): Promise<ListarHistoricoResponse> {
    const result = await this.repo.historico(produtoId, page, limit)
    return right(result)
  }
}
