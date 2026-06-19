import { Injectable } from '@nestjs/common'
import { type Either, left, right } from '../../../../core/either'
import { ColaboradoresRepository } from '../repositories/colaboradores-repository'
import { ColaboradorNaoEncontradoError } from './errors/colaborador-nao-encontrado.error'

interface DeleteColaboradorUseCaseRequest {
  colaboradorId: number
}

type DeleteColaboradorUseCaseResponse = Either<
  ColaboradorNaoEncontradoError,
  null
>

@Injectable()
export class DeleteColaboradorUseCase {
  constructor(private colaboradoresRepository: ColaboradoresRepository) {}

  async execute({
    colaboradorId,
  }: DeleteColaboradorUseCaseRequest): Promise<DeleteColaboradorUseCaseResponse> {
    const existe = await this.colaboradoresRepository.findById(colaboradorId)
    if (!existe) return left(new ColaboradorNaoEncontradoError(colaboradorId))

    await this.colaboradoresRepository.softDelete(colaboradorId)
    return right(null)
  }
}
