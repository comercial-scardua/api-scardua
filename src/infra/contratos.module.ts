import { Module } from '@nestjs/common'
import { ContratosRepository } from '../domain/contratos/application/repositories/contratos-repository'
import { AcaoContratoUseCase } from '../domain/contratos/application/use-cases/acao-contrato'
import { CreateContratoUseCase } from '../domain/contratos/application/use-cases/create-contrato'
import { DeleteContratoUseCase } from '../domain/contratos/application/use-cases/delete-contrato'
import { EditContratoUseCase } from '../domain/contratos/application/use-cases/edit-contrato'
import { FetchContratosUseCase } from '../domain/contratos/application/use-cases/fetch-contratos'
import { GerenciarArquivoContratoUseCase } from '../domain/contratos/application/use-cases/gerenciar-arquivo-contrato'
import { GetContratoUseCase } from '../domain/contratos/application/use-cases/get-contrato'
import { PrismaContratosRepository } from './database/prisma/repositories/prisma-contratos-repository'
import { AcaoContratoController } from './http/controllers/contratos/acao-contrato.controller'
import { AddArquivoContratoController } from './http/controllers/contratos/add-arquivo-contrato.controller'
import { CreateContratoController } from './http/controllers/contratos/create-contrato.controller'
import { DeleteContratoController } from './http/controllers/contratos/delete-contrato.controller'
import { EditContratoController } from './http/controllers/contratos/edit-contrato.controller'
import { FetchContratosController } from './http/controllers/contratos/fetch-contratos.controller'
import { GetArquivoContratoController } from './http/controllers/contratos/get-arquivo-contrato.controller'
import { GetContratoController } from './http/controllers/contratos/get-contrato.controller'
import { RemoveArquivoContratoController } from './http/controllers/contratos/remove-arquivo-contrato.controller'
import { UploadUrlContratoController } from './http/controllers/contratos/upload-url-contrato.controller'

@Module({
  controllers: [
    FetchContratosController,
    CreateContratoController,
    UploadUrlContratoController,
    AddArquivoContratoController,
    GetArquivoContratoController,
    RemoveArquivoContratoController,
    GetContratoController,
    EditContratoController,
    AcaoContratoController,
    DeleteContratoController,
  ],
  providers: [
    FetchContratosUseCase,
    GetContratoUseCase,
    CreateContratoUseCase,
    EditContratoUseCase,
    AcaoContratoUseCase,
    DeleteContratoUseCase,
    GerenciarArquivoContratoUseCase,
    { provide: ContratosRepository, useClass: PrismaContratosRepository },
  ],
})
export class ContratosModule {}
