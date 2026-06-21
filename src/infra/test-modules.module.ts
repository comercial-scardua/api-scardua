import { Module } from '@nestjs/common'
import { Test52NcmsUseCase } from '../domain/test-modules/application/use-cases/test-52-ncms'
import { TestBatch50UseCase } from '../domain/test-modules/application/use-cases/test-batch-50'
import { TestBatchSizesUseCase } from '../domain/test-modules/application/use-cases/test-batch-sizes'
import { TestSyncHorasUseCase } from '../domain/test-modules/application/use-cases/test-sync-horas'
import { Test52NcmsController } from './http/controllers/test-modules/test-52-ncms.controller'
import { TestBatch50Controller } from './http/controllers/test-modules/test-batch-50.controller'
import { TestBatchSizesController } from './http/controllers/test-modules/test-batch-sizes.controller'
import { TestSyncHorasController } from './http/controllers/test-modules/test-sync-horas.controller'

@Module({
  controllers: [
    Test52NcmsController,
    TestBatch50Controller,
    TestBatchSizesController,
    TestSyncHorasController,
  ],
  providers: [
    Test52NcmsUseCase,
    TestBatch50UseCase,
    TestBatchSizesUseCase,
    TestSyncHorasUseCase,
  ],
})
export class TestModulesModule {}
