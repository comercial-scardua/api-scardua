import { Module } from '@nestjs/common'
import { ManuaisRepository } from '../domain/manuais/application/repositories/manuais-repository'
import { AtualizarManualUseCase } from '../domain/manuais/application/use-cases/atualizar-manual'
import { BuscarManualUseCase } from '../domain/manuais/application/use-cases/buscar-manual'
import { CriarManualUseCase } from '../domain/manuais/application/use-cases/criar-manual'
import { DesativarManualUseCase } from '../domain/manuais/application/use-cases/desativar-manual'
import { GerenciarArquivoManualUseCase } from '../domain/manuais/application/use-cases/gerenciar-arquivo-manual'
import { PrismaManuaisRepository } from './database/prisma/repositories/prisma-manuais-repository'
import { AddArquivoManualController } from './http/controllers/manuais/add-arquivo-manual.controller'
import { CreateManualController } from './http/controllers/manuais/create-manual.controller'
import { DeleteManualController } from './http/controllers/manuais/delete-manual.controller'
import { EditManualController } from './http/controllers/manuais/edit-manual.controller'
import { FetchManuaisController } from './http/controllers/manuais/fetch-manuais.controller'
import { FetchManuaisDetailsController } from './http/controllers/manuais/fetch-manuais-details.controller'
import { GetArquivoManualController } from './http/controllers/manuais/get-arquivo-manual.controller'
import { GetManualController } from './http/controllers/manuais/get-manual.controller'
import { GetManualDescricaoController } from './http/controllers/manuais/get-manual-descricao.controller'
import { RemoveArquivoManualController } from './http/controllers/manuais/remove-arquivo-manual.controller'
import { RemoveArquivoManualLegacyController } from './http/controllers/manuais/remove-arquivo-manual-legacy.controller'

@Module({
  controllers: [
    FetchManuaisController,
    FetchManuaisDetailsController,
    CreateManualController,
    AddArquivoManualController,
    GetManualDescricaoController,
    RemoveArquivoManualLegacyController,
    GetArquivoManualController,
    GetManualController,
    EditManualController,
    RemoveArquivoManualController,
    DeleteManualController,
  ],
  providers: [
    BuscarManualUseCase,
    CriarManualUseCase,
    AtualizarManualUseCase,
    DesativarManualUseCase,
    GerenciarArquivoManualUseCase,
    { provide: ManuaisRepository, useClass: PrismaManuaisRepository },
  ],
})
export class ManuaisModule {}
