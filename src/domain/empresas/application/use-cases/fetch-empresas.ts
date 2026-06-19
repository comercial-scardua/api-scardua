import { Injectable } from '@nestjs/common'
import { type Either, right } from '../../../../core/either'
import {
  EmpresasRepository,
  type FindAllEmpresasFilters,
  type ListaEmpresasResult,
} from '../repositories/empresas-repository'

type FetchEmpresasUseCaseResponse = Either<null, ListaEmpresasResult>

@Injectable()
export class FetchEmpresasUseCase {
  constructor(private empresasRepository: EmpresasRepository) {}

  async execute(
    filters: FindAllEmpresasFilters,
  ): Promise<FetchEmpresasUseCaseResponse> {
    const result = await this.empresasRepository.findAll(filters)
    return right(result)
  }
}
