import { Injectable } from '@nestjs/common'
import { type Either, left, right } from '../../../../core/either'
import {
  type CreateEmpresaData,
  type EmpresaCompleta,
  EmpresasRepository,
} from '../repositories/empresas-repository'
import { CnpjJaCadastradoError } from './errors/cnpj-ja-cadastrado.error'

interface CreateEmpresaUseCaseRequest {
  data: CreateEmpresaData
  criadoPorId: string
}

type CreateEmpresaUseCaseResponse = Either<
  CnpjJaCadastradoError,
  { empresa: EmpresaCompleta }
>

@Injectable()
export class CreateEmpresaUseCase {
  constructor(private empresasRepository: EmpresasRepository) {}

  async execute({
    data,
    criadoPorId,
  }: CreateEmpresaUseCaseRequest): Promise<CreateEmpresaUseCaseResponse> {
    if (data.cnpj) {
      const existente = await this.empresasRepository.findByCnpj(data.cnpj)
      if (existente) return left(new CnpjJaCadastradoError(data.cnpj))
    }

    const empresa = await this.empresasRepository.create(data, criadoPorId)
    return right({ empresa })
  }
}
