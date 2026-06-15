import { Module } from '@nestjs/common';
import { MovimentacaoController } from './movimentacao.controller';
import { MovimentacaoRepository } from './repositories/movimentacao.repository';

@Module({
  controllers: [MovimentacaoController],
  providers: [MovimentacaoRepository],
})
export class MovimentacaoModule {}
