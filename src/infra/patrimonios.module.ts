import { Module } from '@nestjs/common'
import { PatrimoniosRepository } from '../domain/patrimonios/application/repositories/patrimonios-repository'
import { CheckPatrimonioSerialUseCase } from '../domain/patrimonios/application/use-cases/check-patrimonio-serial'
import { CreatePatrimonioUseCase } from '../domain/patrimonios/application/use-cases/create-patrimonio'
import { EditPatrimonioUseCase } from '../domain/patrimonios/application/use-cases/edit-patrimonio'
import { FetchPatrimoniosUseCase } from '../domain/patrimonios/application/use-cases/fetch-patrimonios'
import { FetchVeiculosUseCase } from '../domain/patrimonios/application/use-cases/fetch-veiculos'
import { GetPatrimonioUseCase } from '../domain/patrimonios/application/use-cases/get-patrimonio'
import { GetPatrimonioStatsUseCase } from '../domain/patrimonios/application/use-cases/get-patrimonio-stats'
import { ToggleVisibilidadePatrimonioUseCase } from '../domain/patrimonios/application/use-cases/toggle-visibilidade-patrimonio'
import { PrismaPatrimoniosRepository } from './database/prisma/repositories/prisma-patrimonios-repository'
import { CheckSerialController } from './http/controllers/patrimonios/check-serial.controller'
import { CreatePatrimonioController } from './http/controllers/patrimonios/create-patrimonio.controller'
import { EditPatrimonioController } from './http/controllers/patrimonios/edit-patrimonio.controller'
import { FetchPatrimoniosController } from './http/controllers/patrimonios/fetch-patrimonios.controller'
import { FetchVeiculosController } from './http/controllers/patrimonios/fetch-veiculos.controller'
import { GenerateDocController } from './http/controllers/patrimonios/generate-doc.controller'
import { GetPatrimonioController } from './http/controllers/patrimonios/get-patrimonio.controller'
import { PatrimonioStatsController } from './http/controllers/patrimonios/patrimonio-stats.controller'
import { TogglePatrimonioController } from './http/controllers/patrimonios/toggle-patrimonio.controller'

@Module({
  controllers: [
    FetchPatrimoniosController,
    FetchVeiculosController,
    PatrimonioStatsController,
    CheckSerialController,
    GenerateDocController,
    CreatePatrimonioController,
    GetPatrimonioController,
    EditPatrimonioController,
    TogglePatrimonioController,
  ],
  providers: [
    FetchPatrimoniosUseCase,
    FetchVeiculosUseCase,
    GetPatrimonioStatsUseCase,
    CheckPatrimonioSerialUseCase,
    GetPatrimonioUseCase,
    CreatePatrimonioUseCase,
    EditPatrimonioUseCase,
    ToggleVisibilidadePatrimonioUseCase,
    { provide: PatrimoniosRepository, useClass: PrismaPatrimoniosRepository },
  ],
})
export class PatrimoniosModule {}
