import { Injectable } from '@nestjs/common'
import { type Either, right } from '../../../../core/either'
import {
  type DepartamentoRow,
  UniformeRepository,
} from '../repositories/uniforme-repository'

export interface CreateDepartamentoRequest {
  nome: string
  descricao?: string | null
}

type CreateDepartamentoResponse = Either<
  never,
  { departamento: DepartamentoRow }
>

@Injectable()
export class CreateDepartamentoUseCase {
  constructor(private repo: UniformeRepository) {}

  async execute(
    req: CreateDepartamentoRequest,
  ): Promise<CreateDepartamentoResponse> {
    const departamento = await this.repo.createDepartamento(
      req.nome.trim(),
      req.descricao?.trim() || null,
    )
    return right({ departamento })
  }
}
