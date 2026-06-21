import { Injectable } from '@nestjs/common'
import { type Either, right } from '../../../../core/either'
import { CaixaViagemRepository } from '../repositories/caixa-viagem-repository'

type FetchAllCaixasViagemUseCaseResponse = Either<null, { caixas: unknown[] }>

@Injectable()
export class FetchAllCaixasViagemUseCase {
  constructor(private caixaViagemRepository: CaixaViagemRepository) {}

  async execute(
    showHidden: boolean,
  ): Promise<FetchAllCaixasViagemUseCaseResponse> {
    const caixas = await this.caixaViagemRepository.findAll(showHidden)
    return right({ caixas })
  }
}
