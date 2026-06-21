import { Module } from '@nestjs/common'
import { CheckCpfUseCase } from '../domain/check-cpf/application/use-cases/check-cpf'
import { CheckCpfController } from './http/controllers/check-cpf/check-cpf.controller'

@Module({
  controllers: [CheckCpfController],
  providers: [CheckCpfUseCase],
})
export class CheckCpfModule {}
