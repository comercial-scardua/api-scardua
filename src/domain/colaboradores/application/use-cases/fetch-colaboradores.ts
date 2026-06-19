import { Injectable } from '@nestjs/common'
import type { colaboradores } from '@prisma/client'
import { type Either, right } from '../../../../core/either'
import { ColaboradoresRepository } from '../repositories/colaboradores-repository'

interface FetchColaboradoresUseCaseRequest {
  cpf?: string
  simple?: boolean
}

type FetchColaboradoresUseCaseResponse = Either<
  null,
  { colaboradores: Partial<colaboradores>[] }
>

@Injectable()
export class FetchColaboradoresUseCase {
  constructor(private colaboradoresRepository: ColaboradoresRepository) {}

  async execute({
    cpf,
    simple = false,
  }: FetchColaboradoresUseCaseRequest): Promise<FetchColaboradoresUseCaseResponse> {
    const colaboradores = await this.colaboradoresRepository.findAll({
      cpf,
      simple,
    })
    return right({ colaboradores })
  }
}
