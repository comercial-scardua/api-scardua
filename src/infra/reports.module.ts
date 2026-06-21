import { Module } from '@nestjs/common'
import { RunReportQueryUseCase } from '../domain/reports/application/use-cases/run-report-query'
import { RunReportQueryController } from './http/controllers/reports/run-report-query.controller'

@Module({
  controllers: [RunReportQueryController],
  providers: [RunReportQueryUseCase],
})
export class ReportsModule {}
