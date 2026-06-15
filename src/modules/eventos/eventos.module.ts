import { Module } from '@nestjs/common';
import { EventosController } from './eventos.controller';
import { EventosRepository } from './repositories/eventos.repository';

@Module({
  controllers: [EventosController],
  providers: [EventosRepository],
})
export class EventosModule {}
