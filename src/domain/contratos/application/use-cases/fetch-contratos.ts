import { Injectable } from '@nestjs/common'
import { type Either, right } from '../../../../core/either'
import {
  type ContratoComArquivos,
  ContratosRepository,
} from '../repositories/contratos-repository'

type FetchContratosUseCaseResponse = Either<
  null,
  { contratos: ContratoComArquivos[] }
>

@Injectable()
export class FetchContratosUseCase {
  constructor(private contratosRepository: ContratosRepository) {}

  async execute(): Promise<FetchContratosUseCaseResponse> {
    const contratos = await this.contratosRepository.findAll()
    return right({ contratos })
  }
}
