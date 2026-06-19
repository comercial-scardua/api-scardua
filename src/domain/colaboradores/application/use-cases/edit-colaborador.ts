import { Injectable } from '@nestjs/common'
import type { colaboradores } from '@prisma/client'
import { type Either, left, right } from '../../../../core/either'
import type { UpdateColaboradorData } from '../dtos/colaborador-schema'
import { ColaboradoresRepository } from '../repositories/colaboradores-repository'
import { ColaboradorNaoEncontradoError } from './errors/colaborador-nao-encontrado.error'

interface EditColaboradorUseCaseRequest {
  colaboradorId: number
  data: UpdateColaboradorData
}

type EditColaboradorUseCaseResponse = Either<
  ColaboradorNaoEncontradoError,
  { colaborador: colaboradores }
>

@Injectable()
export class EditColaboradorUseCase {
  constructor(private colaboradoresRepository: ColaboradoresRepository) {}

  async execute({
    colaboradorId,
    data,
  }: EditColaboradorUseCaseRequest): Promise<EditColaboradorUseCaseResponse> {
    const existe = await this.colaboradoresRepository.findById(colaboradorId)
    if (!existe) return left(new ColaboradorNaoEncontradoError(colaboradorId))

    const colaborador = await this.colaboradoresRepository.update(
      colaboradorId,
      data,
    )
    return right({ colaborador })
  }
}
