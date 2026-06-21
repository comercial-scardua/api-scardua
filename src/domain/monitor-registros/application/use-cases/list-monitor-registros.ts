import { Injectable } from '@nestjs/common'
import { type Either, right } from '../../../../core/either'
import {
  type MonitorRegistroFilters,
  type MonitorRegistroResult,
  MonitorRegistrosRepository,
} from '../repositories/monitor-registros-repository'

type ListMonitorRegistrosResponse = Either<never, MonitorRegistroResult>

@Injectable()
export class ListMonitorRegistrosUseCase {
  constructor(private repo: MonitorRegistrosRepository) {}

  async execute(
    filters: MonitorRegistroFilters,
  ): Promise<ListMonitorRegistrosResponse> {
    const result = await this.repo.findAll(filters)
    return right(result)
  }
}
