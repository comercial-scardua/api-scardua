import { Injectable } from '@nestjs/common'
import { type Either, left, right } from '../../../../core/either'
import { ContaCorrenteRepository } from '../repositories/conta-corrente-repository'
import { ContaNaoEncontradaError } from './errors/conta-nao-encontrada.error'

interface ExcluirContaCorrenteUseCaseRequest {
  id: number
}

type ExcluirContaCorrenteUseCaseResponse = Either<ContaNaoEncontradaError, null>

@Injectable()
export class ExcluirContaCorrenteUseCase {
  constructor(private contaCorrenteRepository: ContaCorrenteRepository) {}

  async execute({
    id,
  }: ExcluirContaCorrenteUseCaseRequest): Promise<ExcluirContaCorrenteUseCaseResponse> {
    const existe = await this.contaCorrenteRepository.findById(id)
    if (!existe) return left(new ContaNaoEncontradaError(id))

    await this.contaCorrenteRepository.excluir(id)
    return right(null)
  }
}
