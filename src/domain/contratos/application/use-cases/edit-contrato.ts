import { Injectable } from '@nestjs/common'
import type { contratos } from '@prisma/client'
import { type Either, left, right } from '../../../../core/either'
import {
  ContratosRepository,
  type UpdateContratoData,
} from '../repositories/contratos-repository'
import { ContratoNaoEncontradoError } from './errors/contrato-nao-encontrado.error'

interface EditContratoUseCaseRequest {
  contratoId: number
  data: UpdateContratoData
}

type EditContratoUseCaseResponse = Either<
  ContratoNaoEncontradoError,
  { contrato: contratos }
>

@Injectable()
export class EditContratoUseCase {
  constructor(private contratosRepository: ContratosRepository) {}

  async execute({
    contratoId,
    data,
  }: EditContratoUseCaseRequest): Promise<EditContratoUseCaseResponse> {
    const existe = await this.contratosRepository.findById(contratoId)
    if (!existe) return left(new ContratoNaoEncontradoError(contratoId))

    const contrato = await this.contratosRepository.update(contratoId, data)
    return right({ contrato })
  }
}
