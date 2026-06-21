import { Module } from '@nestjs/common'
import { ImportacaoPrecosRepository } from '../domain/importacao-precos/application/repositories/importacao-precos-repository'
import { ExportarPrecosUseCase } from '../domain/importacao-precos/application/use-cases/exportar-precos'
import { ImportarPrecosUseCase } from '../domain/importacao-precos/application/use-cases/importar-precos'
import { ListarCategoriasUseCase } from '../domain/importacao-precos/application/use-cases/listar-categorias'
import { ListarGruposUseCase } from '../domain/importacao-precos/application/use-cases/listar-grupos'
import { ListarMarcasUseCase } from '../domain/importacao-precos/application/use-cases/listar-marcas'
import { PrismaImportacaoPrecosRepository } from './database/prisma/repositories/prisma-importacao-precos-repository'
import { ExportarPrecosController } from './http/controllers/importacao-precos/exportar-precos.controller'
import { ImportarPrecosController } from './http/controllers/importacao-precos/importar-precos.controller'
import { ListarCategoriasController } from './http/controllers/importacao-precos/listar-categorias.controller'
import { ListarGruposController } from './http/controllers/importacao-precos/listar-grupos.controller'
import { ListarMarcasController } from './http/controllers/importacao-precos/listar-marcas.controller'

@Module({
  controllers: [
    ImportarPrecosController,
    ExportarPrecosController,
    ListarCategoriasController,
    ListarGruposController,
    ListarMarcasController,
  ],
  providers: [
    ImportarPrecosUseCase,
    ExportarPrecosUseCase,
    ListarCategoriasUseCase,
    ListarGruposUseCase,
    ListarMarcasUseCase,
    {
      provide: ImportacaoPrecosRepository,
      useClass: PrismaImportacaoPrecosRepository,
    },
  ],
})
export class ImportacaoPrecosModule {}
