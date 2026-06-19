import { Injectable } from '@nestjs/common'
import { type Either, left, right } from '../../../../core/either'
import { UniformeRepository } from '../repositories/uniforme-repository'
import { DepartamentoComVinculosError } from './errors/departamento-com-vinculos.error'

type DeleteDepartamentoResponse = Either<DepartamentoComVinculosError, null>

@Injectable()
export class DeleteDepartamentoUseCase {
  constructor(private repo: UniformeRepository) {}

  async execute(id: number): Promise<DeleteDepartamentoResponse> {
    const vinculados = await this.repo.countVinculosByCargo(id)
    if (vinculados > 0) return left(new DepartamentoComVinculosError())

    await this.repo.deleteDepartamento(id)
    return right(null)
  }
}
