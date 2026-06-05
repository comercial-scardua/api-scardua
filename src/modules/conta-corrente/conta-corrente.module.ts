import { Module } from '@nestjs/common';
import { ContaCorrenteController } from './conta-corrente.controller';
import { ContaCorrenteRepository } from './repositories/conta-corrente.repository';
import { PrismaContaCorrenteRepository } from './repositories/prisma-conta-corrente.repository';
import { ExcluirContaUseCase } from './use-cases/excluir-conta.use-case';

@Module({
  controllers: [ContaCorrenteController],
  providers: [
    { provide: ContaCorrenteRepository, useClass: PrismaContaCorrenteRepository },
    ExcluirContaUseCase,
  ],
})
export class ContaCorrenteModule {}
