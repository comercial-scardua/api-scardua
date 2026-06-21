import { Injectable } from '@nestjs/common'
import type { conta_corrente } from '@prisma/client'
import { type Either, left, right } from '../../../../core/either'
import { ContaCorrenteRepository } from '../repositories/conta-corrente-repository'
import { ContaNaoEncontradaError } from './errors/conta-nao-encontrada.error'

interface ToggleOcultoContaUseCaseRequest {
  id: number
}

type ToggleOcultoContaUseCaseResponse = Either<
  ContaNaoEncontradaError,
  { conta: conta_corrente }
>

@Injectable()
export class ToggleOcultoContaUseCase {
  constructor(private contaCorrenteRepository: ContaCorrenteRepository) {}

  async execute({
    id,
  }: ToggleOcultoContaUseCaseRequest): Promise<ToggleOcultoContaUseCaseResponse> {
    const existe = await this.contaCorrenteRepository.findById(id)
    if (!existe) return left(new ContaNaoEncontradaError(id))

    const conta = await this.contaCorrenteRepository.toggleOculto(id)
    return right({ conta })
  }
}
