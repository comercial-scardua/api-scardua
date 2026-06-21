import { Injectable } from '@nestjs/common'
import { type Either, right } from '../../../../core/either'
import {
  type NcmListFilters,
  type NcmListResult,
  NcmUtilitiesRepository,
} from '../repositories/ncm-utilities-repository'

type ListNcmsResponse = Either<never, NcmListResult>

@Injectable()
export class ListNcmsUseCase {
  constructor(private repo: NcmUtilitiesRepository) {}

  async execute(filters: NcmListFilters): Promise<ListNcmsResponse> {
    const result = await this.repo.listNcms(filters)
    return right(result)
  }
}
