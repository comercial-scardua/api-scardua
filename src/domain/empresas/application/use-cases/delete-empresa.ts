import { Injectable } from '@nestjs/common'
import { type Either, left, right } from '../../../../core/either'
import { EmpresasRepository } from '../repositories/empresas-repository'
import { EmpresaNaoEncontradaError } from './errors/empresa-nao-encontrada.error'

interface DeleteEmpresaUseCaseRequest {
  empresaId: number
}

type DeleteEmpresaUseCaseResponse = Either<EmpresaNaoEncontradaError, null>

@Injectable()
export class DeleteEmpresaUseCase {
  constructor(private empresasRepository: EmpresasRepository) {}

  async execute({
    empresaId,
  }: DeleteEmpresaUseCaseRequest): Promise<DeleteEmpresaUseCaseResponse> {
    const existe = await this.empresasRepository.findById(empresaId)
    if (!existe) return left(new EmpresaNaoEncontradaError(empresaId))

    await this.empresasRepository.softDelete(empresaId)
    return right(null)
  }
}
