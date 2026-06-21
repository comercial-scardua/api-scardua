import { Injectable } from '@nestjs/common'
import { type Either, right } from '../../../../core/either'
import {
  type NcmDiagnostico,
  NcmUtilitiesRepository,
} from '../repositories/ncm-utilities-repository'

type DiagnoseNcmLimitResponse = Either<never, NcmDiagnostico>

@Injectable()
export class DiagnoseNcmLimitUseCase {
  constructor(private repo: NcmUtilitiesRepository) {}

  async execute(): Promise<DiagnoseNcmLimitResponse> {
    const result = await this.repo.diagnoseNcmLimit()
    return right(result)
  }
}
