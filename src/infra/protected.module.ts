import { Module } from '@nestjs/common'
import { GetProtectedUseCase } from '../domain/protected/application/use-cases/get-protected'
import { GetProtectedController } from './http/controllers/protected/get-protected.controller'

@Module({
  controllers: [GetProtectedController],
  providers: [GetProtectedUseCase],
})
export class ProtectedModule {}
