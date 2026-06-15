import { Module } from '@nestjs/common';
import { DebugController, DebugUtilsController } from './debug.controller';

@Module({
  controllers: [DebugController, DebugUtilsController],
})
export class DebugModule {}
