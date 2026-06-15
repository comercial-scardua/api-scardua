import { Module } from '@nestjs/common';
import { CaixaViagemController } from './caixa-viagem.controller';
import { CaixaViagemRepository } from './repositories/caixa-viagem.repository';

@Module({
  controllers: [CaixaViagemController],
  providers: [CaixaViagemRepository],
})
export class CaixaViagemModule {}
