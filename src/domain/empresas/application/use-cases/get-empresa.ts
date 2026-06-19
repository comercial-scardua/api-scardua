import { Injectable } from '@nestjs/common'
import { type Either, left, right } from '../../../../core/either'
import {
  type EmpresaCompleta,
  EmpresasRepository,
} from '../repositories/empresas-repository'
import { EmpresaNaoEncontradaError } from './errors/empresa-nao-encontrada.error'

interface GetEmpresaUseCaseRequest {
  empresaId: number
}

type GetEmpresaUseCaseResponse = Either<
  EmpresaNaoEncontradaError,
  { empresa: EmpresaCompleta }
>

@Injectable()
export class GetEmpresaUseCase {
  constructor(private empresasRepository: EmpresasRepository) {}

  async execute({
    empresaId,
  }: GetEmpresaUseCaseRequest): Promise<GetEmpresaUseCaseResponse> {
    const empresa = await this.empresasRepository.findById(empresaId)
    if (!empresa) return left(new EmpresaNaoEncontradaError(empresaId))
    return right({ empresa })
  }
}
