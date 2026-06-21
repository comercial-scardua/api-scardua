import { Injectable } from '@nestjs/common'
import { type Either, right } from '../../../../core/either'
import {
  type AtualizarPrecosData,
  type AtualizarPrecosResult,
  PrecificadorRepository,
} from '../repositories/precificador-repository'

type AtualizarPrecosLoteResponse = Either<never, AtualizarPrecosResult>

@Injectable()
export class AtualizarPrecosLoteUseCase {
  constructor(private repo: PrecificadorRepository) {}

  async execute(
    data: AtualizarPrecosData,
  ): Promise<AtualizarPrecosLoteResponse> {
    const result = await this.repo.atualizarPrecos(data)
    return right(result)
  }
}
