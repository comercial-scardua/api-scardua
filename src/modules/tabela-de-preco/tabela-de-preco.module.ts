import { Module } from '@nestjs/common';
import { TabelaDePrecoController } from './tabela-de-preco.controller';

@Module({
  controllers: [TabelaDePrecoController],
})
export class TabelaDePrecoModule {}
