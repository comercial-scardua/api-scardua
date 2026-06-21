import { Module } from '@nestjs/common'
import { GestorEmpresasRepository } from '../domain/gestor-empresas/application/repositories/gestor-empresas-repository'
import { ListGestoresEmpresasUseCase } from '../domain/gestor-empresas/application/use-cases/list-gestores-empresas'
import { UpsertGestorEmpresaUseCase } from '../domain/gestor-empresas/application/use-cases/upsert-gestor-empresa'
import { PrismaGestorEmpresasRepository } from './database/prisma/repositories/prisma-gestor-empresas-repository'
import { ListGestoresEmpresasController } from './http/controllers/gestor-empresas/list-gestores-empresas.controller'
import { UpsertGestorEmpresaController } from './http/controllers/gestor-empresas/upsert-gestor-empresa.controller'

@Module({
  controllers: [ListGestoresEmpresasController, UpsertGestorEmpresaController],
  providers: [
    ListGestoresEmpresasUseCase,
    UpsertGestorEmpresaUseCase,
    {
      provide: GestorEmpresasRepository,
      useClass: PrismaGestorEmpresasRepository,
    },
  ],
})
export class GestorEmpresasModule {}
