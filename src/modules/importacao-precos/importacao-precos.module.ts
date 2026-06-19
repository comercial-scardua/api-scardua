import { Module } from '@nestjs/common'
import { ImportacaoPrecosController } from './importacao-precos.controller'
import { ImportacaoPrecosRepository } from './repositories/importacao-precos.repository'

@Module({
  controllers: [ImportacaoPrecosController],
  providers: [ImportacaoPrecosRepository],
})
export class ImportacaoPrecosModule {}
