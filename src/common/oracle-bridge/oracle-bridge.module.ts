import { Global, Module } from '@nestjs/common'
import { OracleBridgeService } from './oracle-bridge.service'

@Global()
@Module({
  providers: [OracleBridgeService],
  exports: [OracleBridgeService],
})
export class OracleBridgeModule {}
