import { Injectable } from '@nestjs/common'
import { type Either, right } from '../../../../core/either'
import {
  type EmpresaSimples,
  EmpresasRepository,
} from '../repositories/empresas-repository'

type ListEmpresasSimplesUseCaseResponse = Either<
  null,
  { empresas: EmpresaSimples[] }
>

@Injectable()
export class ListEmpresasSimplesUseCase {
  constructor(private empresasRepository: EmpresasRepository) {}

  async execute(): Promise<ListEmpresasSimplesUseCaseResponse> {
    const empresas = await this.empresasRepository.findSimple()
    return right({ empresas })
  }
}
