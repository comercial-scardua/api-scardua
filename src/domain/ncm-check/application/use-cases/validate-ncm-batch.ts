import { Injectable } from '@nestjs/common'
import { type Either, right } from '../../../../core/either'
import {
  NcmCheckRepository,
  type NcmRecord,
} from '../repositories/ncm-check-repository'

type NcmBatchItem = {
  ncm: string
  valid: boolean
  found: NcmRecord | null
}

export type ValidateBatchResult = {
  results: NcmBatchItem[]
  total: number
  valid: number
  invalid: number
}

type ValidateBatchResponse = Either<null, ValidateBatchResult>

@Injectable()
export class ValidateNcmBatchUseCase {
  constructor(private ncmCheckRepository: NcmCheckRepository) {}

  async execute({ ncms }: { ncms: string[] }): Promise<ValidateBatchResponse> {
    const results = await Promise.all(
      ncms.map(async (ncmCode) => {
        const code = ncmCode.trim()
        const found = await this.ncmCheckRepository.findByCodigoPrefix(code)
        return { ncm: code, valid: found !== null, found: found ?? null }
      }),
    )

    const validCount = results.filter((r) => r.valid).length

    return right({
      results,
      total: results.length,
      valid: validCount,
      invalid: results.length - validCount,
    })
  }
}
