import { Module } from '@nestjs/common'
import { SuporteRepository } from './repositories/suporte.repository'
import { SuporteController } from './suporte.controller'

@Module({
  controllers: [SuporteController],
  providers: [SuporteRepository],
})
export class SuporteModule {}
