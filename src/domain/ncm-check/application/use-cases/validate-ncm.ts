import { Injectable } from '@nestjs/common'
import { type Either, right } from '../../../../core/either'
import {
  NcmCheckRepository,
  type NcmRecord,
} from '../repositories/ncm-check-repository'

export type ValidateNcmResult = {
  valid: boolean
  ncm: string
  found: NcmRecord | null
}

type ValidateNcmResponse = Either<null, ValidateNcmResult>

@Injectable()
export class ValidateNcmUseCase {
  constructor(private ncmCheckRepository: NcmCheckRepository) {}

  async execute({ ncm }: { ncm: string }): Promise<ValidateNcmResponse> {
    const ncmCode = ncm.trim()
    const found = await this.ncmCheckRepository.findByCodigoPrefix(ncmCode)

    return right({
      valid: found !== null,
      ncm: ncmCode,
      found: found ?? null,
    })
  }
}
