import { Injectable } from '@nestjs/common'
import type { conta_corrente } from '@prisma/client'
import { type Either, left, right } from '../../../../core/either'
import {
  ContaCorrenteRepository,
  type CreateContaCorrenteData,
} from '../repositories/conta-corrente-repository'
import { ContaNaoEncontradaError } from './errors/conta-nao-encontrada.error'

interface UpdateContaCorrenteUseCaseRequest {
  id: number
  data: Partial<CreateContaCorrenteData>
}

type UpdateContaCorrenteUseCaseResponse = Either<
  ContaNaoEncontradaError,
  { conta: conta_corrente }
>

@Injectable()
export class UpdateContaCorrenteUseCase {
  constructor(private contaCorrenteRepository: ContaCorrenteRepository) {}

  async execute({
    id,
    data,
  }: UpdateContaCorrenteUseCaseRequest): Promise<UpdateContaCorrenteUseCaseResponse> {
    const existe = await this.contaCorrenteRepository.findById(id)
    if (!existe) return left(new ContaNaoEncontradaError(id))

    const conta = await this.contaCorrenteRepository.update(id, data)
    return right({ conta })
  }
}
