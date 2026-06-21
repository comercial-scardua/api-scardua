import { Injectable } from '@nestjs/common'
import { type Either, right } from '../../../../core/either'
import {
  type NcmSearchFilters,
  NcmUtilitiesRepository,
} from '../repositories/ncm-utilities-repository'

type SearchNcmResponse = Either<never, { total: number; data: unknown[] }>

@Injectable()
export class SearchNcmUseCase {
  constructor(private repo: NcmUtilitiesRepository) {}

  async execute(filters: NcmSearchFilters): Promise<SearchNcmResponse> {
    const result = await this.repo.searchNcm(filters)
    return right(result)
  }
}
