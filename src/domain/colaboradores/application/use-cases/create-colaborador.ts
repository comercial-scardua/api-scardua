import { Injectable } from '@nestjs/common'
import { type Either, left, right } from '../../../../core/either'
import type { CreateColaboradorData } from '../dtos/colaborador-schema'
import { ColaboradoresRepository } from '../repositories/colaboradores-repository'
import { CpfJaCadastradoError } from './errors/cpf-ja-cadastrado.error'

type CreateColaboradorUseCaseResponse = Either<
  CpfJaCadastradoError,
  { colaboradorId: number }
>

@Injectable()
export class CreateColaboradorUseCase {
  constructor(private colaboradoresRepository: ColaboradoresRepository) {}

  async execute(
    data: CreateColaboradorData,
  ): Promise<CreateColaboradorUseCaseResponse> {
    const existente = await this.colaboradoresRepository.findByCpf(data.cpf)
    if (existente) return left(new CpfJaCadastradoError(data.cpf))

    const colaborador = await this.colaboradoresRepository.create(data)
    return right({ colaboradorId: colaborador.id })
  }
}
