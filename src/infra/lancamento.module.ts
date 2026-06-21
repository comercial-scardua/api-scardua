import { Module } from '@nestjs/common'
import { LancamentoRepository } from '../domain/lancamento/application/repositories/lancamento-repository'
import { CreateLancamentosUseCase } from '../domain/lancamento/application/use-cases/create-lancamentos'
import { CreateLancamentosForUserUseCase } from '../domain/lancamento/application/use-cases/create-lancamentos-for-user'
import { RemoveLancamentoForUserUseCase } from '../domain/lancamento/application/use-cases/remove-lancamento-for-user'
import { RemoveLancamentosByContaUseCase } from '../domain/lancamento/application/use-cases/remove-lancamentos-by-conta'
import { PrismaLancamentoRepository } from './database/prisma/repositories/prisma-lancamento-repository'
import { CreateLancamentosController } from './http/controllers/lancamento/create-lancamentos.controller'
import { CreateLancamentosForUserController } from './http/controllers/lancamento/create-lancamentos-for-user.controller'
import { RemoveLancamentoForUserController } from './http/controllers/lancamento/remove-lancamento-for-user.controller'
import { RemoveLancamentosByContaController } from './http/controllers/lancamento/remove-lancamentos-by-conta.controller'

@Module({
  controllers: [
    CreateLancamentosController,
    RemoveLancamentosByContaController,
    CreateLancamentosForUserController,
    RemoveLancamentoForUserController,
  ],
  providers: [
    CreateLancamentosUseCase,
    RemoveLancamentosByContaUseCase,
    CreateLancamentosForUserUseCase,
    RemoveLancamentoForUserUseCase,
    { provide: LancamentoRepository, useClass: PrismaLancamentoRepository },
  ],
})
export class LancamentoModule {}
