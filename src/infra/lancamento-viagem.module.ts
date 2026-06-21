import { Module } from '@nestjs/common'
import { LancamentoViagemRepository } from '../domain/lancamento-viagem/application/repositories/lancamento-viagem-repository'
import { CreateLancamentosViagemUseCase } from '../domain/lancamento-viagem/application/use-cases/create-lancamentos-viagem'
import { CreateLancamentosViagemForColaboradorUseCase } from '../domain/lancamento-viagem/application/use-cases/create-lancamentos-viagem-for-colaborador'
import { FetchLancamentosViagemUseCase } from '../domain/lancamento-viagem/application/use-cases/fetch-lancamentos-viagem'
import { FetchLancamentosViagemByColaboradorUseCase } from '../domain/lancamento-viagem/application/use-cases/fetch-lancamentos-viagem-by-colaborador'
import { PrismaLancamentoViagemRepository } from './database/prisma/repositories/prisma-lancamento-viagem-repository'
import { CreateLancamentosViagemController } from './http/controllers/lancamento-viagem/create-lancamentos-viagem.controller'
import { CreateLancamentosViagemForColaboradorController } from './http/controllers/lancamento-viagem/create-lancamentos-viagem-for-colaborador.controller'
import { FetchLancamentosViagemController } from './http/controllers/lancamento-viagem/fetch-lancamentos-viagem.controller'
import { FetchLancamentosViagemByColaboradorController } from './http/controllers/lancamento-viagem/fetch-lancamentos-viagem-by-colaborador.controller'

@Module({
  controllers: [
    FetchLancamentosViagemController,
    CreateLancamentosViagemController,
    FetchLancamentosViagemByColaboradorController,
    CreateLancamentosViagemForColaboradorController,
  ],
  providers: [
    FetchLancamentosViagemUseCase,
    CreateLancamentosViagemUseCase,
    FetchLancamentosViagemByColaboradorUseCase,
    CreateLancamentosViagemForColaboradorUseCase,
    {
      provide: LancamentoViagemRepository,
      useClass: PrismaLancamentoViagemRepository,
    },
  ],
})
export class LancamentoViagemModule {}
