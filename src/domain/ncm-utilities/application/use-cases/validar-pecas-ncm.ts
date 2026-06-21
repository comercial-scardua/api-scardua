import { Injectable } from '@nestjs/common'
import { type Either, right } from '../../../../core/either'
import {
  NcmUtilitiesRepository,
  type PecasSemNcmResult,
} from '../repositories/ncm-utilities-repository'

type ValidarPecasNcmResponse = Either<never, PecasSemNcmResult>

@Injectable()
export class ValidarPecasNcmUseCase {
  constructor(private repo: NcmUtilitiesRepository) {}

  async execute(): Promise<ValidarPecasNcmResponse> {
    const result = await this.repo.validarPecasNcm()
    return right(result)
  }
}
