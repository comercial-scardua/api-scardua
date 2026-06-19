import { Module } from '@nestjs/common'
import { AniversariantesRepository } from '../domain/aniversariantes/application/repositories/aniversariantes-repository'
import { FetchAniversariantesUseCase } from '../domain/aniversariantes/application/use-cases/fetch-aniversariantes'
import { PrismaAniversariantesRepository } from './database/prisma/repositories/prisma-aniversariantes-repository'
import { FetchAniversariantesController } from './http/controllers/aniversariantes/fetch-aniversariantes.controller'

@Module({
  controllers: [FetchAniversariantesController],
  providers: [
    FetchAniversariantesUseCase,
    {
      provide: AniversariantesRepository,
      useClass: PrismaAniversariantesRepository,
    },
  ],
})
export class AniversariantesModule {}
