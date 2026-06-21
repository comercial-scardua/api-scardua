import { Module } from '@nestjs/common'
import { GetStatusUseCase } from '../domain/status/application/use-cases/get-status'
import { GetStatusController } from './http/controllers/status/get-status.controller'

@Module({
  controllers: [GetStatusController],
  providers: [GetStatusUseCase],
})
export class StatusModule {}
