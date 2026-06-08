import { Module } from '@nestjs/common';
import { ColaboradoresController } from './colaboradores.controller';
import { ColaboradoresRepository } from './repositories/colaboradores.repository';
import { PrismaColaboradoresRepository } from './repositories/prisma-colaboradores.repository';
import { AtualizarColaboradorUseCase } from './use-cases/atualizar-colaborador.use-case';
import { AtualizarFotoColaboradorUseCase } from './use-cases/atualizar-foto-colaborador.use-case';
import { BuscarColaboradorUseCase } from './use-cases/buscar-colaborador.use-case';
import { CriarColaboradorUseCase } from './use-cases/criar-colaborador.use-case';
import { DesativarColaboradorUseCase } from './use-cases/desativar-colaborador.use-case';
import { ListarColaboradoresUseCase } from './use-cases/listar-colaboradores.use-case';

@Module({
  controllers: [ColaboradoresController],
  providers: [
    {
      provide: ColaboradoresRepository,
      useClass: PrismaColaboradoresRepository,
    },
    ListarColaboradoresUseCase,
    BuscarColaboradorUseCase,
    CriarColaboradorUseCase,
    AtualizarColaboradorUseCase,
    DesativarColaboradorUseCase,
    AtualizarFotoColaboradorUseCase,
  ],
})
export class ColaboradoresModule {}
