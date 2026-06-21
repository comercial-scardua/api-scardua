import { Injectable } from '@nestjs/common'
import { type Either, right } from '../../../../core/either'
import {
  MonitorRegistrosRepository,
  type UpsertMonitorRegistroData,
} from '../repositories/monitor-registros-repository'

type UpsertMonitorRegistroResponse = Either<never, { registro: unknown }>

@Injectable()
export class UpsertMonitorRegistroUseCase {
  constructor(private repo: MonitorRegistrosRepository) {}

  async execute(
    data: UpsertMonitorRegistroData,
  ): Promise<UpsertMonitorRegistroResponse> {
    const registro = await this.repo.upsert(data)
    return right({ registro })
  }
}
