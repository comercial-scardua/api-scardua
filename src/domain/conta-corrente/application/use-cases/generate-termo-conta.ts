import { Injectable } from '@nestjs/common'
import { type Either, right } from '../../../../core/either'
import { ContaCorrenteRepository } from '../repositories/conta-corrente-repository'

interface GenerateTermoContaUseCaseRequest {
  userId: string
}

type GenerateTermoContaUseCaseResponse = Either<
  never,
  {
    titulo: string
    dataGeracao: string
    userId: string
    resumo: unknown
    contas: unknown
  }
>

@Injectable()
export class GenerateTermoContaUseCase {
  constructor(private contaCorrenteRepository: ContaCorrenteRepository) {}

  async execute({
    userId,
  }: GenerateTermoContaUseCaseRequest): Promise<GenerateTermoContaUseCaseResponse> {
    const contas = await this.contaCorrenteRepository.findByUserId(userId)
    const resumo = await this.contaCorrenteRepository.resumo(userId)

    return right({
      titulo: 'Termo de Conta Corrente',
      dataGeracao: new Date().toISOString(),
      userId,
      resumo,
      contas,
    })
  }
}
