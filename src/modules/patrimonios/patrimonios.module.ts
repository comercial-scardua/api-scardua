import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PatrimoniosController } from './patrimonios.controller';
import { PatrimoniosRepository } from './repositories/patrimonios.repository';
import { PrismaPatrimoniosRepository } from './repositories/prisma-patrimonios.repository';
import { AlternarVisibilidadePatrimonioUseCase } from './use-cases/alternar-visibilidade-patrimonio.use-case';
import { AtualizarPatrimonioUseCase } from './use-cases/atualizar-patrimonio.use-case';
import { BuscarPatrimonioUseCase } from './use-cases/buscar-patrimonio.use-case';

@Module({
  controllers: [PatrimoniosController],
  providers: [
    { provide: PatrimoniosRepository, useClass: PrismaPatrimoniosRepository },
    BuscarPatrimonioUseCase,
    AtualizarPatrimonioUseCase,
    AlternarVisibilidadePatrimonioUseCase,
    PrismaService,
  ],
})
export class PatrimoniosModule {}
