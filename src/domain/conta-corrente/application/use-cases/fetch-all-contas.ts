import { Injectable } from '@nestjs/common'
import { type Either, right } from '../../../../core/either'
import {
  type ContaComLancamentos,
  ContaCorrenteRepository,
} from '../repositories/conta-corrente-repository'

interface FetchAllContasUseCaseRequest {
  showHidden?: boolean
}

type FetchAllContasUseCaseResponse = Either<
  never,
  { contas: ContaComLancamentos[] }
>

@Injectable()
export class FetchAllContasUseCase {
  constructor(private contaCorrenteRepository: ContaCorrenteRepository) {}

  async execute({
    showHidden,
  }: FetchAllContasUseCaseRequest): Promise<FetchAllContasUseCaseResponse> {
    const contas = await this.contaCorrenteRepository.findAll(showHidden)
    return right({ contas })
  }
}
