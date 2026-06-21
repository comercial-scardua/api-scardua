import { Injectable } from '@nestjs/common'
import { type Either, left, right } from '../../../../core/either'
import {
  type AtualizarCaixaViagemData,
  CaixaViagemRepository,
} from '../repositories/caixa-viagem-repository'
import { NenhumCaixaFuncionarioError } from './errors/nenhum-caixa-funcionario.error'

interface UpdateUltimoCaixaFuncionarioUseCaseRequest {
  funcionarioId: number
  data: AtualizarCaixaViagemData
}

type UpdateUltimoCaixaFuncionarioUseCaseResponse = Either<
  NenhumCaixaFuncionarioError,
  { caixa: unknown }
>

@Injectable()
export class UpdateUltimoCaixaFuncionarioUseCase {
  constructor(private caixaViagemRepository: CaixaViagemRepository) {}

  async execute({
    funcionarioId,
    data,
  }: UpdateUltimoCaixaFuncionarioUseCaseRequest): Promise<UpdateUltimoCaixaFuncionarioUseCaseResponse> {
    const caixa =
      await this.caixaViagemRepository.findUltimoCaixaFuncionario(funcionarioId)
    if (!caixa) return left(new NenhumCaixaFuncionarioError(funcionarioId))

    const updated = await this.caixaViagemRepository.update(caixa.id, data)
    return right({ caixa: updated })
  }
}
