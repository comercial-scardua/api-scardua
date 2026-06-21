import { Injectable } from '@nestjs/common'
import { type Either, right } from '../../../../core/either'
import {
  type NcmIntegridade,
  NcmUtilitiesRepository,
} from '../repositories/ncm-utilities-repository'

type FinalNcmValidationResponse = Either<never, NcmIntegridade>

@Injectable()
export class FinalNcmValidationUseCase {
  constructor(private repo: NcmUtilitiesRepository) {}

  async execute(): Promise<FinalNcmValidationResponse> {
    const result = await this.repo.finalNcmValidation()
    return right(result)
  }
}
