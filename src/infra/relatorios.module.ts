import { Module } from '@nestjs/common'
import { RelatoriosRepository } from '../domain/relatorios/application/repositories/relatorios-repository'
import { CreateRelatorioUseCase } from '../domain/relatorios/application/use-cases/create-relatorio'
import { DeleteRelatorioUseCase } from '../domain/relatorios/application/use-cases/delete-relatorio'
import { EditRelatorioUseCase } from '../domain/relatorios/application/use-cases/edit-relatorio'
import { FetchRelatoriosUseCase } from '../domain/relatorios/application/use-cases/fetch-relatorios'
import { GetRelatorioUseCase } from '../domain/relatorios/application/use-cases/get-relatorio'
import { GetRelatorioPermissionsUseCase } from '../domain/relatorios/application/use-cases/get-relatorio-permissions'
import { SetRelatorioPermissionsUseCase } from '../domain/relatorios/application/use-cases/set-relatorio-permissions'
import { PrismaRelatoriosRepository } from './database/prisma/repositories/prisma-relatorios-repository'
import { CreateRelatorioController } from './http/controllers/relatorios/create-relatorio.controller'
import { DeleteRelatorioController } from './http/controllers/relatorios/delete-relatorio.controller'
import { EditRelatorioController } from './http/controllers/relatorios/edit-relatorio.controller'
import { ExecuteRelatorioController } from './http/controllers/relatorios/execute-relatorio.controller'
import { FetchRelatoriosController } from './http/controllers/relatorios/fetch-relatorios.controller'
import { GetRelatorioController } from './http/controllers/relatorios/get-relatorio.controller'
import { RelatorioPermissionsController } from './http/controllers/relatorios/relatorio-permissions.controller'

/**
 * Ordem dos controllers importa para o roteamento: rotas estáticas
 * (POST /relatorios/execute) devem ser registradas ANTES das paramétricas
 * (POST /relatorios/:id).
 */
@Module({
  controllers: [
    FetchRelatoriosController,
    CreateRelatorioController,
    ExecuteRelatorioController,
    RelatorioPermissionsController,
    GetRelatorioController,
    EditRelatorioController,
    DeleteRelatorioController,
  ],
  providers: [
    FetchRelatoriosUseCase,
    GetRelatorioUseCase,
    CreateRelatorioUseCase,
    EditRelatorioUseCase,
    DeleteRelatorioUseCase,
    GetRelatorioPermissionsUseCase,
    SetRelatorioPermissionsUseCase,
    { provide: RelatoriosRepository, useClass: PrismaRelatoriosRepository },
  ],
})
export class RelatoriosModule {}
