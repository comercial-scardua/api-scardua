import { Injectable } from '@nestjs/common'
import { type Either, right } from '../../../../core/either'
import {
  type AtualizarPrecosData,
  type AtualizarPrecosResult,
  PrecificadorRepository,
} from '../repositories/precificador-repository'

type AtualizarPrecosResponse = Either<never, AtualizarPrecosResult>

@Injectable()
export class AtualizarPrecosUseCase {
  constructor(private repo: PrecificadorRepository) {}

  async execute(data: AtualizarPrecosData): Promise<AtualizarPrecosResponse> {
    const result = await this.repo.atualizarPrecos(data)
    return right(result)
  }
}
