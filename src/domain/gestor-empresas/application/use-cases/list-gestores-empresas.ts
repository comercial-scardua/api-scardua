import { Injectable } from '@nestjs/common'
import { type Either, right } from '../../../../core/either'
import {
  type FindAllGestorEmpresasFilters,
  type GestorEmpresaCompleta,
  GestorEmpresasRepository,
} from '../repositories/gestor-empresas-repository'

type ListGestoresEmpresasUseCaseResponse = Either<
  null,
  { gestores: GestorEmpresaCompleta[] }
>

@Injectable()
export class ListGestoresEmpresasUseCase {
  constructor(private gestorEmpresasRepository: GestorEmpresasRepository) {}

  async execute(
    filters: FindAllGestorEmpresasFilters,
  ): Promise<ListGestoresEmpresasUseCaseResponse> {
    const gestores = await this.gestorEmpresasRepository.findAll(filters)
    return right({ gestores })
  }
}
