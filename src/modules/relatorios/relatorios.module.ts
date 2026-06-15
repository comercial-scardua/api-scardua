import { Module } from '@nestjs/common';
import { RelatoriosController } from './relatorios.controller';
import { RelatoriosRepository } from './repositories/relatorios.repository';

@Module({
  controllers: [RelatoriosController],
  providers: [RelatoriosRepository],
})
export class RelatoriosModule {}
