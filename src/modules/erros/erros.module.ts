import { Module } from '@nestjs/common';
import { ErrosController } from './erros.controller';
import { ErrosRepository } from './repositories/erros.repository';

@Module({
  controllers: [ErrosController],
  providers: [ErrosRepository],
})
export class ErrosModule {}
