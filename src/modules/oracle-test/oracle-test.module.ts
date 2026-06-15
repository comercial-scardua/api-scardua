import { Module } from '@nestjs/common';
import { OracleTestController } from './oracle-test.controller';

@Module({
  controllers: [OracleTestController],
})
export class OracleTestModule {}
