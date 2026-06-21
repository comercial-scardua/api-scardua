import { Module } from '@nestjs/common'
import { MonitorRegistrosRepository } from '../domain/monitor-registros/application/repositories/monitor-registros-repository'
import { ListMonitorRegistrosUseCase } from '../domain/monitor-registros/application/use-cases/list-monitor-registros'
import { UpsertMonitorRegistroUseCase } from '../domain/monitor-registros/application/use-cases/upsert-monitor-registro'
import { PrismaMonitorRegistrosRepository } from './database/prisma/repositories/prisma-monitor-registros-repository'
import { ListMonitorRegistrosController } from './http/controllers/monitor-registros/list-monitor-registros.controller'
import { UpsertMonitorRegistroController } from './http/controllers/monitor-registros/upsert-monitor-registro.controller'

@Module({
  controllers: [
    ListMonitorRegistrosController,
    UpsertMonitorRegistroController,
  ],
  providers: [
    ListMonitorRegistrosUseCase,
    UpsertMonitorRegistroUseCase,
    {
      provide: MonitorRegistrosRepository,
      useClass: PrismaMonitorRegistrosRepository,
    },
  ],
})
export class MonitorRegistrosModule {}
