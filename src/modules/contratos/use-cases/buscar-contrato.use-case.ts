import { Injectable } from '@nestjs/common'
import { type Either, left, right } from '../../../core/either'
import type { ContratoComArquivos } from '../repositories/contratos.repository'
import { ContratosRepository } from '../repositories/contratos.repository'
import { ContratoNaoEncontradoError } from './errors/contrato-nao-encontrado.error'

type BuscarContratoResult = Either<
  ContratoNaoEncontradoError,
  { contrato: ContratoComArquivos }
>

@Injectable()
export class BuscarContratoUseCase {
  constructor(private repo: ContratosRepository) {}

  async execute(id: number): Promise<BuscarContratoResult> {
    const contrato = await this.repo.findById(id)
    if (!contrato) return left(new ContratoNaoEncontradoError(id))
    return right({ contrato })
  }
}
