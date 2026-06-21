import { Injectable } from '@nestjs/common'
import { type Either, right } from '../../../../core/either'
import {
  ContaCorrenteRepository,
  type ResumoContas,
} from '../repositories/conta-corrente-repository'

interface GetResumoContaUseCaseRequest {
  userId: string
}

type GetResumoContaUseCaseResponse = Either<never, ResumoContas>

@Injectable()
export class GetResumoContaUseCase {
  constructor(private contaCorrenteRepository: ContaCorrenteRepository) {}

  async execute({
    userId,
  }: GetResumoContaUseCaseRequest): Promise<GetResumoContaUseCaseResponse> {
    const resumo = await this.contaCorrenteRepository.resumo(userId)
    return right(resumo)
  }
}
