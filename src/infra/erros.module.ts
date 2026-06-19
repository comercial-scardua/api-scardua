import { Module } from '@nestjs/common'
import { ErrosRepository } from '../domain/erros/application/repositories/erros-repository'
import { CreateErroUseCase } from '../domain/erros/application/use-cases/create-erro'
import { EditErroUseCase } from '../domain/erros/application/use-cases/edit-erro'
import { FetchErrosUseCase } from '../domain/erros/application/use-cases/fetch-erros'
import { GetErroUseCase } from '../domain/erros/application/use-cases/get-erro'
import { PrismaErrosRepository } from './database/prisma/repositories/prisma-erros-repository'
import { CreateErroController } from './http/controllers/erros/create-erro.controller'
import { EditErroController } from './http/controllers/erros/edit-erro.controller'
import { FetchErrosController } from './http/controllers/erros/fetch-erros.controller'
import { GetErroController } from './http/controllers/erros/get-erro.controller'

@Module({
  controllers: [
    FetchErrosController,
    GetErroController,
    CreateErroController,
    EditErroController,
  ],
  providers: [
    FetchErrosUseCase,
    GetErroUseCase,
    CreateErroUseCase,
    EditErroUseCase,
    { provide: ErrosRepository, useClass: PrismaErrosRepository },
  ],
})
export class ErrosModule {}
