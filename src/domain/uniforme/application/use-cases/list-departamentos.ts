import { Injectable } from '@nestjs/common'
import { type Either, right } from '../../../../core/either'
import {
  type DepartamentoRow,
  UniformeRepository,
} from '../repositories/uniforme-repository'

type ListDepartamentosResponse = Either<
  never,
  { departamentos: DepartamentoRow[] }
>

@Injectable()
export class ListDepartamentosUseCase {
  constructor(private repo: UniformeRepository) {}

  async execute(): Promise<ListDepartamentosResponse> {
    const departamentos = await this.repo.listDepartamentos()
    return right({ departamentos })
  }
}
