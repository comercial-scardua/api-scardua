import { Module } from '@nestjs/common';
import { AniversariantesController } from './aniversariantes.controller';
import { AniversariantesRepository } from './repositories/aniversariantes.repository';
import { PrismaAniversariantesRepository } from './repositories/prisma-aniversariantes.repository';
import { ListarAniversariantesUseCase } from './use-cases/listar-aniversariantes.use-case';

@Module({
  controllers: [AniversariantesController],
  providers: [
    {
      provide: AniversariantesRepository,
      useClass: PrismaAniversariantesRepository,
    },
    ListarAniversariantesUseCase,
  ],
})
export class AniversariantesModule {}
