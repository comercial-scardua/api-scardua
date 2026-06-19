import { Module } from '@nestjs/common'
import { TestModulesController } from './test-modules.controller'

@Module({
  controllers: [TestModulesController],
})
export class TestModulesModule {}
