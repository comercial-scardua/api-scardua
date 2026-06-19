import { Injectable } from '@nestjs/common'
import type { contratos } from '@prisma/client'
import { type Either, left, right } from '../../../../core/either'
import { ContratosRepository } from '../repositories/contratos-repository'
import { ContratoNaoEncontradoError } from './errors/contrato-nao-encontrado.error'

export type AcaoContrato = 'finalizar' | 'renovar'

interface AcaoContratoUseCaseRequest {
  contratoId: number
  acao: AcaoContrato
}

type AcaoContratoUseCaseResponse = Either<
  ContratoNaoEncontradoError,
  { contrato: contratos }
>

@Injectable()
export class AcaoContratoUseCase {
  constructor(private contratosRepository: ContratosRepository) {}

  async execute({
    contratoId,
    acao,
  }: AcaoContratoUseCaseRequest): Promise<AcaoContratoUseCaseResponse> {
    const existe = await this.contratosRepository.findById(contratoId)
    if (!existe) return left(new ContratoNaoEncontradoError(contratoId))

    const contrato =
      acao === 'finalizar'
        ? await this.contratosRepository.alternarStatus(contratoId)
        : await this.contratosRepository.renovar(contratoId)

    return right({ contrato })
  }
}
