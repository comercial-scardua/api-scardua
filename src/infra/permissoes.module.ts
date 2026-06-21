import { Module } from '@nestjs/common'
import { PermissoesRepository } from '../domain/permissoes/application/repositories/permissoes-repository'
import { DefinirPermissaoPaginaUseCase } from '../domain/permissoes/application/use-cases/definir-permissao-pagina'
import { DefinirPermissoesUseCase } from '../domain/permissoes/application/use-cases/definir-permissoes'
import { ListarPermissoesUseCase } from '../domain/permissoes/application/use-cases/listar-permissoes'
import { RemoverPermissaoUseCase } from '../domain/permissoes/application/use-cases/remover-permissao'
import { PrismaPermissoesRepository } from './database/prisma/repositories/prisma-permissoes-repository'
import { DefinirPermissaoPaginaController } from './http/controllers/permissoes/definir-permissao-pagina.controller'
import { DefinirPermissoesController } from './http/controllers/permissoes/definir-permissoes.controller'
import { ListarPaginasController } from './http/controllers/permissoes/listar-paginas.controller'
import { ListarPermissoesController } from './http/controllers/permissoes/listar-permissoes.controller'
import { RemoverPermissaoController } from './http/controllers/permissoes/remover-permissao.controller'

@Module({
  controllers: [
    ListarPaginasController,
    ListarPermissoesController,
    DefinirPermissoesController,
    DefinirPermissaoPaginaController,
    RemoverPermissaoController,
  ],
  providers: [
    ListarPermissoesUseCase,
    DefinirPermissoesUseCase,
    DefinirPermissaoPaginaUseCase,
    RemoverPermissaoUseCase,
    { provide: PermissoesRepository, useClass: PrismaPermissoesRepository },
  ],
})
export class PermissoesModule {}
