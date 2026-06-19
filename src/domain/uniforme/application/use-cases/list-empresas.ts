import { Injectable } from '@nestjs/common'
import { type Either, right } from '../../../../core/either'
import {
  type EmpresaSimples,
  UniformeRepository,
} from '../repositories/uniforme-repository'

type ListEmpresasResponse = Either<never, { empresas: EmpresaSimples[] }>

@Injectable()
export class ListEmpresasUseCase {
  constructor(private repo: UniformeRepository) {}

  async execute(): Promise<ListEmpresasResponse> {
    const empresas = await this.repo.listEmpresas()
    return right({ empresas })
  }
}
