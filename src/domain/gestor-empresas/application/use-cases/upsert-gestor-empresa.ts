import { Injectable } from '@nestjs/common'
import { type Either, right } from '../../../../core/either'
import {
  type CriarGestorEmpresaData,
  type GestorEmpresaCompleta,
  GestorEmpresasRepository,
} from '../repositories/gestor-empresas-repository'

type UpsertGestorEmpresaUseCaseResponse = Either<
  null,
  { gestor: GestorEmpresaCompleta }
>

@Injectable()
export class UpsertGestorEmpresaUseCase {
  constructor(private gestorEmpresasRepository: GestorEmpresasRepository) {}

  async execute(
    data: CriarGestorEmpresaData,
  ): Promise<UpsertGestorEmpresaUseCaseResponse> {
    const gestor = await this.gestorEmpresasRepository.upsert(data)
    return right({ gestor })
  }
}
