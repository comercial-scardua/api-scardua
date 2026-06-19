import { Module } from '@nestjs/common'
import { PrecoVendaController } from './preco-venda.controller'

@Module({
  controllers: [PrecoVendaController],
})
export class PrecoVendaModule {}
