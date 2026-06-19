import { Module } from '@nestjs/common'
import { MovimentacaoRepository } from '../domain/movimentacao/application/repositories/movimentacao-repository'
import { CreateMovimentacaoUseCase } from '../domain/movimentacao/application/use-cases/create-movimentacao'
import { FetchMovimentacoesUseCase } from '../domain/movimentacao/application/use-cases/fetch-movimentacoes'
import { PrismaMovimentacaoRepository } from './database/prisma/repositories/prisma-movimentacao-repository'
import { CreateMovimentacaoController } from './http/controllers/movimentacao/create-movimentacao.controller'
import { FetchMovimentacoesController } from './http/controllers/movimentacao/fetch-movimentacoes.controller'

@Module({
  controllers: [FetchMovimentacoesController, CreateMovimentacaoController],
  providers: [
    FetchMovimentacoesUseCase,
    CreateMovimentacaoUseCase,
    { provide: MovimentacaoRepository, useClass: PrismaMovimentacaoRepository },
  ],
})
export class MovimentacaoModule {}
