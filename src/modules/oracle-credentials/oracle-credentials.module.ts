import { Module } from '@nestjs/common'
import { OracleCredentialsController } from './oracle-credentials.controller'

@Module({
  controllers: [OracleCredentialsController],
})
export class OracleCredentialsModule {}
