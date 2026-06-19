import { Module } from '@nestjs/common'
import { ColaboradoresRepository } from '../domain/colaboradores/application/repositories/colaboradores-repository'
import { CreateColaboradorUseCase } from '../domain/colaboradores/application/use-cases/create-colaborador'
import { DeleteColaboradorUseCase } from '../domain/colaboradores/application/use-cases/delete-colaborador'
import { EditColaboradorUseCase } from '../domain/colaboradores/application/use-cases/edit-colaborador'
import { FetchColaboradoresUseCase } from '../domain/colaboradores/application/use-cases/fetch-colaboradores'
import { GetColaboradorUseCase } from '../domain/colaboradores/application/use-cases/get-colaborador'
import { GetColaboradorByUserUseCase } from '../domain/colaboradores/application/use-cases/get-colaborador-by-user'
import { ListColaboradorTermosUseCase } from '../domain/colaboradores/application/use-cases/list-colaborador-termos'
import { UpdateFotoColaboradorUseCase } from '../domain/colaboradores/application/use-cases/update-foto-colaborador'
import { PrismaColaboradoresRepository } from './database/prisma/repositories/prisma-colaboradores-repository'
import { CreateColaboradorController } from './http/controllers/colaboradores/create-colaborador.controller'
import { DeleteColaboradorController } from './http/controllers/colaboradores/delete-colaborador.controller'
import { EditColaboradorController } from './http/controllers/colaboradores/edit-colaborador.controller'
import { FetchColaboradoresController } from './http/controllers/colaboradores/fetch-colaboradores.controller'
import { GetColaboradorController } from './http/controllers/colaboradores/get-colaborador.controller'
import { GetColaboradorFotoController } from './http/controllers/colaboradores/get-colaborador-foto.controller'
import { GetMeColaboradorController } from './http/controllers/colaboradores/get-me-colaborador.controller'
import { ListColaboradorTermosController } from './http/controllers/colaboradores/list-colaborador-termos.controller'
import { UpdateColaboradorByBodyController } from './http/controllers/colaboradores/update-colaborador-by-body.controller'
import { UpdateFotoColaboradorController } from './http/controllers/colaboradores/update-foto-colaborador.controller'

@Module({
  controllers: [
    FetchColaboradoresController,
    GetMeColaboradorController,
    UpdateColaboradorByBodyController,
    CreateColaboradorController,
    UpdateFotoColaboradorController,
    GetColaboradorFotoController,
    ListColaboradorTermosController,
    GetColaboradorController,
    EditColaboradorController,
    DeleteColaboradorController,
  ],
  providers: [
    FetchColaboradoresUseCase,
    GetColaboradorByUserUseCase,
    GetColaboradorUseCase,
    CreateColaboradorUseCase,
    EditColaboradorUseCase,
    DeleteColaboradorUseCase,
    UpdateFotoColaboradorUseCase,
    ListColaboradorTermosUseCase,
    {
      provide: ColaboradoresRepository,
      useClass: PrismaColaboradoresRepository,
    },
  ],
})
export class ColaboradoresModule {}
