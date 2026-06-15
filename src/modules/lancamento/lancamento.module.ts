import { Module } from '@nestjs/common';
import { LancamentoController } from './lancamento.controller';
import { LancamentoRepository } from './repositories/lancamento.repository';

@Module({
  controllers: [LancamentoController],
  providers: [LancamentoRepository],
})
export class LancamentoModule {}
