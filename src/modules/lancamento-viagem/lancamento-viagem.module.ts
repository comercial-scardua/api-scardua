import { Module } from '@nestjs/common';
import { LancamentoViagemController } from './lancamento-viagem.controller';
import { LancamentoViagemRepository } from './repositories/lancamento-viagem.repository';

@Module({
  controllers: [LancamentoViagemController],
  providers: [LancamentoViagemRepository],
})
export class LancamentoViagemModule {}
