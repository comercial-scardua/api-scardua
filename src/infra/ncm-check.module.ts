import { Module } from '@nestjs/common'
import { NcmCheckRepository } from '../domain/ncm-check/application/repositories/ncm-check-repository'
import { ValidateNcmUseCase } from '../domain/ncm-check/application/use-cases/validate-ncm'
import { ValidateNcmBatchUseCase } from '../domain/ncm-check/application/use-cases/validate-ncm-batch'
import { PrismaNcmCheckRepository } from './database/prisma/repositories/prisma-ncm-check-repository'
import { ValidateNcmController } from './http/controllers/ncm-check/validate-ncm.controller'
import { ValidateNcmBatchController } from './http/controllers/ncm-check/validate-ncm-batch.controller'

@Module({
  controllers: [ValidateNcmController, ValidateNcmBatchController],
  providers: [
    ValidateNcmUseCase,
    ValidateNcmBatchUseCase,
    { provide: NcmCheckRepository, useClass: PrismaNcmCheckRepository },
  ],
})
export class NcmCheckModule {}
