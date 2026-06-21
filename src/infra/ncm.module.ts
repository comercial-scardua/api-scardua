import { Module } from '@nestjs/common'
import { NcmRepository } from '../domain/ncm/application/repositories/ncm-repository'
import { AtualizarNcmUseCase } from '../domain/ncm/application/use-cases/atualizar-ncm'
import { BuscarNcmUseCase } from '../domain/ncm/application/use-cases/buscar-ncm'
import { CriarNcmUseCase } from '../domain/ncm/application/use-cases/criar-ncm'
import { DesativarNcmUseCase } from '../domain/ncm/application/use-cases/desativar-ncm'
import { ImportarNcmUseCase } from '../domain/ncm/application/use-cases/importar-ncm'
import { ListarNcmUseCase } from '../domain/ncm/application/use-cases/listar-ncm'
import { PrismaNcmRepository } from './database/prisma/repositories/prisma-ncm-repository'
import { AtualizarNcmController } from './http/controllers/ncm/atualizar-ncm.controller'
import { BuscarNcmController } from './http/controllers/ncm/buscar-ncm.controller'
import { CriarNcmController } from './http/controllers/ncm/criar-ncm.controller'
import { DesativarNcmController } from './http/controllers/ncm/desativar-ncm.controller'
import { ImportarNcmController } from './http/controllers/ncm/importar-ncm.controller'
import { ListarNcmController } from './http/controllers/ncm/listar-ncm.controller'

@Module({
  controllers: [
    ListarNcmController,
    CriarNcmController,
    ImportarNcmController,
    BuscarNcmController,
    AtualizarNcmController,
    DesativarNcmController,
  ],
  providers: [
    ListarNcmUseCase,
    BuscarNcmUseCase,
    CriarNcmUseCase,
    AtualizarNcmUseCase,
    DesativarNcmUseCase,
    ImportarNcmUseCase,
    { provide: NcmRepository, useClass: PrismaNcmRepository },
  ],
})
export class NcmModule {}
