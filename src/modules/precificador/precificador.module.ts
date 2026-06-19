import { Module } from '@nestjs/common'
import { PrecificadorController } from './precificador.controller'
import { PrecificadorRepository } from './repositories/precificador.repository'

@Module({
  controllers: [PrecificadorController],
  providers: [PrecificadorRepository],
})
export class PrecificadorModule {}
