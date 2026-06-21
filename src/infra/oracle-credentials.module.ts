import { Module } from '@nestjs/common'
import { GetOracleCredentialsUseCase } from '../domain/oracle-credentials/application/use-cases/get-oracle-credentials'
import { GetOracleCredentialsController } from './http/controllers/oracle-credentials/get-oracle-credentials.controller'

@Module({
  controllers: [GetOracleCredentialsController],
  providers: [GetOracleCredentialsUseCase],
})
export class OracleCredentialsModule {}
