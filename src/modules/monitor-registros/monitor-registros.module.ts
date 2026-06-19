import { Module } from '@nestjs/common'
import { MonitorRegistrosController } from './monitor-registros.controller'

@Module({
  controllers: [MonitorRegistrosController],
})
export class MonitorRegistrosModule {}
