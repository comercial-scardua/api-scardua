import { Injectable } from '@nestjs/common'
import type { colaboradores } from '@prisma/client'
import { type Either, right } from '../../../../core/either'
import { ColaboradoresRepository } from '../repositories/colaboradores-repository'

interface GetColaboradorByUserUseCaseRequest {
  userId: string
}

type GetColaboradorByUserUseCaseResponse = Either<
  null,
  { colaborador: colaboradores | null }
>

@Injectable()
export class GetColaboradorByUserUseCase {
  constructor(private colaboradoresRepository: ColaboradoresRepository) {}

  async execute({
    userId,
  }: GetColaboradorByUserUseCaseRequest): Promise<GetColaboradorByUserUseCaseResponse> {
    const colaborador = await this.colaboradoresRepository.findByUserId(userId)
    return right({ colaborador })
  }
}
