import { Module } from '@nestjs/common'
import { BridgeConnectUseCase } from '../domain/bridge/application/use-cases/bridge-connect'
import { BridgeDescribeUseCase } from '../domain/bridge/application/use-cases/bridge-describe'
import { BridgeExecuteUseCase } from '../domain/bridge/application/use-cases/bridge-execute'
import { BridgeTablesUseCase } from '../domain/bridge/application/use-cases/bridge-tables'
import { BridgeConnectController } from './http/controllers/bridge/bridge-connect.controller'
import { BridgeDescribeController } from './http/controllers/bridge/bridge-describe.controller'
import { BridgeExecuteController } from './http/controllers/bridge/bridge-execute.controller'
import { BridgeTablesController } from './http/controllers/bridge/bridge-tables.controller'

@Module({
  controllers: [
    BridgeConnectController,
    BridgeExecuteController,
    BridgeDescribeController,
    BridgeTablesController,
  ],
  providers: [
    BridgeConnectUseCase,
    BridgeExecuteUseCase,
    BridgeDescribeUseCase,
    BridgeTablesUseCase,
  ],
})
export class BridgeModule {}
