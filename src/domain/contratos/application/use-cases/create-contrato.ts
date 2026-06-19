import { Injectable } from '@nestjs/common'
import type { contratos } from '@prisma/client'
import { type Either, left, right } from '../../../../core/either'
import {
  ContratosRepository,
  type CreateContratoData,
} from '../repositories/contratos-repository'
import { NumeroJaCadastradoError } from './errors/numero-ja-cadastrado.error'

type CreateContratoUseCaseResponse = Either<
  NumeroJaCadastradoError,
  { contrato: contratos }
>

@Injectable()
export class CreateContratoUseCase {
  constructor(private contratosRepository: ContratosRepository) {}

  async execute(
    data: CreateContratoData,
  ): Promise<CreateContratoUseCaseResponse> {
    const existente = await this.contratosRepository.findByNumero(data.numero)
    if (existente) return left(new NumeroJaCadastradoError(data.numero))

    const contrato = await this.contratosRepository.create(data)
    return right({ contrato })
  }
}
