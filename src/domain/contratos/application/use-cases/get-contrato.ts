import { Injectable } from '@nestjs/common'
import { type Either, left, right } from '../../../../core/either'
import {
  type ContratoComArquivos,
  ContratosRepository,
} from '../repositories/contratos-repository'
import { ContratoNaoEncontradoError } from './errors/contrato-nao-encontrado.error'

interface GetContratoUseCaseRequest {
  contratoId: number
}

type GetContratoUseCaseResponse = Either<
  ContratoNaoEncontradoError,
  { contrato: ContratoComArquivos }
>

@Injectable()
export class GetContratoUseCase {
  constructor(private contratosRepository: ContratosRepository) {}

  async execute({
    contratoId,
  }: GetContratoUseCaseRequest): Promise<GetContratoUseCaseResponse> {
    const contrato = await this.contratosRepository.findById(contratoId)
    if (!contrato) return left(new ContratoNaoEncontradoError(contratoId))
    return right({ contrato })
  }
}
