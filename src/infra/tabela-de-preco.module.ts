import { Module } from '@nestjs/common'
import { TabelaDePrecoRepository } from '../domain/tabela-de-preco/application/repositories/tabela-de-preco-repository'
import { AtualizarTabelaPrecoUseCase } from '../domain/tabela-de-preco/application/use-cases/atualizar-tabela-preco'
import { GetTemplateTabelaPrecoUseCase } from '../domain/tabela-de-preco/application/use-cases/get-template-tabela-preco'
import { ImportarTabelaPrecoUseCase } from '../domain/tabela-de-preco/application/use-cases/importar-tabela-preco'
import { IncluirTabelaPrecoUseCase } from '../domain/tabela-de-preco/application/use-cases/incluir-tabela-preco'
import { LimparHistoricoTabelaPrecoUseCase } from '../domain/tabela-de-preco/application/use-cases/limpar-historico-tabela-preco'
import { ListHistoricoTabelaPrecoUseCase } from '../domain/tabela-de-preco/application/use-cases/list-historico-tabela-preco'
import { PrismaTabelaDePrecoRepository } from './database/prisma/repositories/prisma-tabela-de-preco-repository'
import { AtualizarTabelaPrecoController } from './http/controllers/tabela-de-preco/atualizar-tabela-preco.controller'
import { GetTemplateTabelaPrecoController } from './http/controllers/tabela-de-preco/get-template-tabela-preco.controller'
import { ImportarTabelaPrecoController } from './http/controllers/tabela-de-preco/importar-tabela-preco.controller'
import { IncluirTabelaPrecoController } from './http/controllers/tabela-de-preco/incluir-tabela-preco.controller'
import { LimparHistoricoTabelaPrecoController } from './http/controllers/tabela-de-preco/limpar-historico-tabela-preco.controller'
import { ListHistoricoTabelaPrecoController } from './http/controllers/tabela-de-preco/list-historico-tabela-preco.controller'

@Module({
  controllers: [
    GetTemplateTabelaPrecoController,
    ListHistoricoTabelaPrecoController,
    IncluirTabelaPrecoController,
    ImportarTabelaPrecoController,
    AtualizarTabelaPrecoController,
    LimparHistoricoTabelaPrecoController,
  ],
  providers: [
    IncluirTabelaPrecoUseCase,
    ImportarTabelaPrecoUseCase,
    AtualizarTabelaPrecoUseCase,
    GetTemplateTabelaPrecoUseCase,
    ListHistoricoTabelaPrecoUseCase,
    LimparHistoricoTabelaPrecoUseCase,
    {
      provide: TabelaDePrecoRepository,
      useClass: PrismaTabelaDePrecoRepository,
    },
  ],
})
export class TabelaDePrecoModule {}
