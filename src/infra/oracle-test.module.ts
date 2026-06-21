import { Module } from '@nestjs/common'
import { ExecuteOracleQueryUseCase } from '../domain/oracle-test/application/use-cases/execute-oracle-query'
import { TestOracleConnectionUseCase } from '../domain/oracle-test/application/use-cases/test-oracle-connection'
import { ExecuteOracleQueryController } from './http/controllers/oracle-test/execute-oracle-query.controller'
import { TestOracleConnectionController } from './http/controllers/oracle-test/test-oracle-connection.controller'

@Module({
  controllers: [TestOracleConnectionController, ExecuteOracleQueryController],
  providers: [TestOracleConnectionUseCase, ExecuteOracleQueryUseCase],
})
export class OracleTestModule {}
