import { Module } from '@nestjs/common'
import { EmpresasRepository } from '../domain/empresas/application/repositories/empresas-repository'
import { CreateEmpresaUseCase } from '../domain/empresas/application/use-cases/create-empresa'
import { DeleteEmpresaUseCase } from '../domain/empresas/application/use-cases/delete-empresa'
import { EditEmpresaUseCase } from '../domain/empresas/application/use-cases/edit-empresa'
import { FetchEmpresasUseCase } from '../domain/empresas/application/use-cases/fetch-empresas'
import { GetEmpresaUseCase } from '../domain/empresas/application/use-cases/get-empresa'
import { ListEmpresasSimplesUseCase } from '../domain/empresas/application/use-cases/list-empresas-simples'
import { PrismaEmpresasRepository } from './database/prisma/repositories/prisma-empresas-repository'
import { CreateEmpresaController } from './http/controllers/empresas/create-empresa.controller'
import { DeleteEmpresaController } from './http/controllers/empresas/delete-empresa.controller'
import { EditEmpresaController } from './http/controllers/empresas/edit-empresa.controller'
import { FetchEmpresasController } from './http/controllers/empresas/fetch-empresas.controller'
import { GetEmpresaController } from './http/controllers/empresas/get-empresa.controller'
import { ListEmpresasSimplesController } from './http/controllers/empresas/list-empresas-simples.controller'

@Module({
  controllers: [
    FetchEmpresasController,
    ListEmpresasSimplesController,
    GetEmpresaController,
    CreateEmpresaController,
    EditEmpresaController,
    DeleteEmpresaController,
  ],
  providers: [
    FetchEmpresasUseCase,
    ListEmpresasSimplesUseCase,
    GetEmpresaUseCase,
    CreateEmpresaUseCase,
    EditEmpresaUseCase,
    DeleteEmpresaUseCase,
    { provide: EmpresasRepository, useClass: PrismaEmpresasRepository },
  ],
})
export class EmpresasModule {}
