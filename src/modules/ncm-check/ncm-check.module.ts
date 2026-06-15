import { Module } from '@nestjs/common';
import { NcmCheckController } from './ncm-check.controller';

@Module({
  controllers: [NcmCheckController],
})
export class NcmCheckModule {}
