import { Module } from '@nestjs/common'
import { OracleQueryConnectUseCase } from '../domain/oracle-query/application/use-cases/oracle-query-connect'
import { OracleQueryDescribeUseCase } from '../domain/oracle-query/application/use-cases/oracle-query-describe'
import { OracleQueryDisconnectUseCase } from '../domain/oracle-query/application/use-cases/oracle-query-disconnect'
import { OracleQueryExecuteUseCase } from '../domain/oracle-query/application/use-cases/oracle-query-execute'
import { OracleQueryTablesUseCase } from '../domain/oracle-query/application/use-cases/oracle-query-tables'
import { OracleQueryUpdateUseCase } from '../domain/oracle-query/application/use-cases/oracle-query-update'
import { OracleQueryConnectController } from './http/controllers/oracle-query/oracle-query-connect.controller'
import { OracleQueryDescribeController } from './http/controllers/oracle-query/oracle-query-describe.controller'
import { OracleQueryDisconnectController } from './http/controllers/oracle-query/oracle-query-disconnect.controller'
import { OracleQueryExecuteController } from './http/controllers/oracle-query/oracle-query-execute.controller'
import { OracleQueryTablesController } from './http/controllers/oracle-query/oracle-query-tables.controller'
import { OracleQueryUpdateController } from './http/controllers/oracle-query/oracle-query-update.controller'

@Module({
  controllers: [
    OracleQueryConnectController,
    OracleQueryDisconnectController,
    OracleQueryExecuteController,
    OracleQueryDescribeController,
    OracleQueryTablesController,
    OracleQueryUpdateController,
  ],
  providers: [
    OracleQueryConnectUseCase,
    OracleQueryDisconnectUseCase,
    OracleQueryExecuteUseCase,
    OracleQueryDescribeUseCase,
    OracleQueryTablesUseCase,
    OracleQueryUpdateUseCase,
  ],
})
export class OracleQueryModule {}
