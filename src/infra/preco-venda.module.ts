import { Module } from '@nestjs/common'
import { PrecoVendaRepository } from '../domain/preco-venda/application/repositories/preco-venda-repository'
import { GetTemplatePrecoVendaUseCase } from '../domain/preco-venda/application/use-cases/get-template-preco-venda'
import { ImportarPrecoVendaUseCase } from '../domain/preco-venda/application/use-cases/importar-preco-venda'
import { IncluirPrecoVendaUseCase } from '../domain/preco-venda/application/use-cases/incluir-preco-venda'
import { PrismaPrecoVendaRepository } from './database/prisma/repositories/prisma-preco-venda-repository'
import { GetTemplatePrecoVendaController } from './http/controllers/preco-venda/get-template-preco-venda.controller'
import { ImportarPrecoVendaController } from './http/controllers/preco-venda/importar-preco-venda.controller'
import { IncluirPrecoVendaController } from './http/controllers/preco-venda/incluir-preco-venda.controller'

@Module({
  controllers: [
    GetTemplatePrecoVendaController,
    IncluirPrecoVendaController,
    ImportarPrecoVendaController,
  ],
  providers: [
    GetTemplatePrecoVendaUseCase,
    IncluirPrecoVendaUseCase,
    ImportarPrecoVendaUseCase,
    { provide: PrecoVendaRepository, useClass: PrismaPrecoVendaRepository },
  ],
})
export class PrecoVendaModule {}
