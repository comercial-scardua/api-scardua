import { Injectable } from '@nestjs/common'
import type { termos_assinados } from '@prisma/client'
import { type Either, left, right } from '../../../../core/either'
import { ColaboradoresRepository } from '../repositories/colaboradores-repository'
import { ColaboradorNaoEncontradoError } from './errors/colaborador-nao-encontrado.error'

interface ListColaboradorTermosUseCaseRequest {
  colaboradorId: number
}

type ListColaboradorTermosUseCaseResponse = Either<
  ColaboradorNaoEncontradoError,
  { termos: termos_assinados[] }
>

@Injectable()
export class ListColaboradorTermosUseCase {
  constructor(private colaboradoresRepository: ColaboradoresRepository) {}

  async execute({
    colaboradorId,
  }: ListColaboradorTermosUseCaseRequest): Promise<ListColaboradorTermosUseCaseResponse> {
    const existe = await this.colaboradoresRepository.findById(colaboradorId)
    if (!existe) return left(new ColaboradorNaoEncontradoError(colaboradorId))

    const termos = await this.colaboradoresRepository.findTermos(colaboradorId)
    return right({ termos })
  }
}
