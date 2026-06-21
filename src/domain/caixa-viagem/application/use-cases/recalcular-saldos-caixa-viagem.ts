import { Injectable } from '@nestjs/common'
import { type Either, right } from '../../../../core/either'
import { CaixaViagemRepository } from '../repositories/caixa-viagem-repository'

type RecalcularSaldosCaixaViagemUseCaseResponse = Either<
  null,
  { message: string }
>

@Injectable()
export class RecalcularSaldosCaixaViagemUseCase {
  constructor(private caixaViagemRepository: CaixaViagemRepository) {}

  async execute(): Promise<RecalcularSaldosCaixaViagemUseCaseResponse> {
    await this.caixaViagemRepository.recalcularSaldos()
    return right({ message: 'Saldos recalculados com sucesso' })
  }
}
