import { Injectable } from '@nestjs/common'
import { type Either, left, right } from '../../../../core/either'
import { CaixaViagemRepository } from '../repositories/caixa-viagem-repository'
import { NenhumCaixaFuncionarioError } from './errors/nenhum-caixa-funcionario.error'

interface FindUltimoCaixaFuncionarioUseCaseRequest {
  funcionarioId: number
}

type FindUltimoCaixaFuncionarioUseCaseResponse = Either<
  NenhumCaixaFuncionarioError,
  { caixa: unknown }
>

@Injectable()
export class FindUltimoCaixaFuncionarioUseCase {
  constructor(private caixaViagemRepository: CaixaViagemRepository) {}

  async execute({
    funcionarioId,
  }: FindUltimoCaixaFuncionarioUseCaseRequest): Promise<FindUltimoCaixaFuncionarioUseCaseResponse> {
    const caixa =
      await this.caixaViagemRepository.findUltimoCaixaFuncionario(funcionarioId)
    if (!caixa) return left(new NenhumCaixaFuncionarioError(funcionarioId))

    return right({ caixa })
  }
}
