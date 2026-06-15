import { Module } from '@nestjs/common';
import { OracleQueryController } from './oracle-query.controller';

@Module({
  controllers: [OracleQueryController],
})
export class OracleQueryModule {}
