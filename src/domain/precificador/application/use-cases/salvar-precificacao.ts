import { Injectable } from '@nestjs/common'
import { type Either, right } from '../../../../core/either'
import {
  PrecificadorRepository,
  type SalvarPrecificacaoData,
} from '../repositories/precificador-repository'

type SalvarPrecificacaoResponse = Either<never, any>

@Injectable()
export class SalvarPrecificacaoUseCase {
  constructor(private repo: PrecificadorRepository) {}

  async execute(
    data: SalvarPrecificacaoData,
  ): Promise<SalvarPrecificacaoResponse> {
    const result = await this.repo.salvar(data)
    return right(result)
  }
}
