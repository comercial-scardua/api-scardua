import { Module } from '@nestjs/common';
import { CheckCpfController } from './check-cpf.controller';

@Module({
  controllers: [CheckCpfController],
})
export class CheckCpfModule {}
