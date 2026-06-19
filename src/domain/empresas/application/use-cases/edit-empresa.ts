import { Injectable } from '@nestjs/common'
import { type Either, left, right } from '../../../../core/either'
import {
  type EmpresaCompleta,
  EmpresasRepository,
  type UpdateEmpresaData,
} from '../repositories/empresas-repository'
import { CnpjJaCadastradoError } from './errors/cnpj-ja-cadastrado.error'
import { EmpresaNaoEncontradaError } from './errors/empresa-nao-encontrada.error'

interface EditEmpresaUseCaseRequest {
  empresaId: number
  data: UpdateEmpresaData
}

type EditEmpresaUseCaseResponse = Either<
  EmpresaNaoEncontradaError | CnpjJaCadastradoError,
  { empresa: EmpresaCompleta }
>

@Injectable()
export class EditEmpresaUseCase {
  constructor(private empresasRepository: EmpresasRepository) {}

  async execute({
    empresaId,
    data,
  }: EditEmpresaUseCaseRequest): Promise<EditEmpresaUseCaseResponse> {
    const existe = await this.empresasRepository.findById(empresaId)
    if (!existe) return left(new EmpresaNaoEncontradaError(empresaId))

    if (data.cnpj && data.cnpj !== existe.cnpj) {
      const cnpjEmUso = await this.empresasRepository.findByCnpj(data.cnpj)
      if (cnpjEmUso) return left(new CnpjJaCadastradoError(data.cnpj))
    }

    const empresa = await this.empresasRepository.update(empresaId, data)
    return right({ empresa })
  }
}
