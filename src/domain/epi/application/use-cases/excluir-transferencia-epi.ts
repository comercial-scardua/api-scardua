import { Injectable } from '@nestjs/common'
import { type Either, left, right } from '../../../../core/either'
import { EpiRepository } from '../repositories/epi-repository'
import { TransferenciaNaoEncontradaError } from './errors/transferencia-nao-encontrada.error'

type Result = Either<TransferenciaNaoEncontradaError, void>

@Injectable()
export class ExcluirTransferenciaEpiUseCase {
  constructor(private repo: EpiRepository) {}

  async execute(id: number): Promise<Result> {
    try {
      await this.repo.deleteTransferencia(id)
      return right(undefined)
    } catch {
      return left(new TransferenciaNaoEncontradaError(id))
    }
  }
}
