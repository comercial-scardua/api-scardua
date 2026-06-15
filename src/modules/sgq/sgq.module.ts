import { Module } from '@nestjs/common'
import { SgqRepository } from './repositories/sgq.repository'
import { SgqController } from './sgq.controller'

@Module({
  controllers: [SgqController],
  providers: [SgqRepository],
})
export class SgqModule {}
