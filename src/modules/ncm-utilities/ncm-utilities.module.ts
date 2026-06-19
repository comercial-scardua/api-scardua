import { Module } from '@nestjs/common'
import { NcmUtilitiesController } from './ncm-utilities.controller'

@Module({
  controllers: [NcmUtilitiesController],
})
export class NcmUtilitiesModule {}
