import { Module } from '@nestjs/common';
import { ColaboradoresController } from './colaboradores.controller';
import { ColaboradoresRepository } from './repositories/colaboradores.repository';
import { PrismaColaboradoresRepository } from './repositories/prisma-colaboradores.repository';
import { BuscarColaboradorUseCase } from './use-cases/buscar-colaborador.use-case';
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
  ],
})
export class ColaboradoresModule {}
