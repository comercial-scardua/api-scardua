import { Injectable } from '@nestjs/common'
import type { colaboradores } from '@prisma/client'
import { type Either, left, right } from '../../../../core/either'
import { ColaboradoresRepository } from '../repositories/colaboradores-repository'
import { ColaboradorNaoEncontradoError } from './errors/colaborador-nao-encontrado.error'

interface GetColaboradorUseCaseRequest {
  colaboradorId: number
}

type GetColaboradorUseCaseResponse = Either<
  ColaboradorNaoEncontradoError,
  { colaborador: colaboradores }
>

@Injectable()
export class GetColaboradorUseCase {
  constructor(private colaboradoresRepository: ColaboradoresRepository) {}

  async execute({
    colaboradorId,
  }: GetColaboradorUseCaseRequest): Promise<GetColaboradorUseCaseResponse> {
    const colaborador =
      await this.colaboradoresRepository.findById(colaboradorId)
    if (!colaborador) {
      return left(new ColaboradorNaoEncontradoError(colaboradorId))
    }
    return right({ colaborador })
  }
}
