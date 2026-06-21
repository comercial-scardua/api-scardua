import { Module } from '@nestjs/common'
import { CheckHealthUseCase } from '../domain/health/application/use-cases/check-health'
import { CheckHealthController } from './http/controllers/health/check-health.controller'

@Module({
  controllers: [CheckHealthController],
  providers: [CheckHealthUseCase],
})
export class HealthModule {}
