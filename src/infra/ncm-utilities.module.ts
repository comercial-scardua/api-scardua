import { Module } from '@nestjs/common'
import { NcmUtilitiesRepository } from '../domain/ncm-utilities/application/repositories/ncm-utilities-repository'
import { CompareNcmQueriesUseCase } from '../domain/ncm-utilities/application/use-cases/compare-ncm-queries'
import { DiagnoseNcmLimitUseCase } from '../domain/ncm-utilities/application/use-cases/diagnose-ncm-limit'
import { FinalNcmValidationUseCase } from '../domain/ncm-utilities/application/use-cases/final-ncm-validation'
import { ListNcmsUseCase } from '../domain/ncm-utilities/application/use-cases/list-ncms'
import { SearchNcmUseCase } from '../domain/ncm-utilities/application/use-cases/search-ncm'
import { ValidarPecasNcmUseCase } from '../domain/ncm-utilities/application/use-cases/validar-pecas-ncm'
import { PrismaNcmUtilitiesRepository } from './database/prisma/repositories/prisma-ncm-utilities-repository'
import { CompareNcmQueriesController } from './http/controllers/ncm-utilities/compare-ncm-queries.controller'
import { DiagnoseNcmLimitController } from './http/controllers/ncm-utilities/diagnose-ncm-limit.controller'
import { FinalNcmValidationController } from './http/controllers/ncm-utilities/final-ncm-validation.controller'
import { ListNcmsController } from './http/controllers/ncm-utilities/list-ncms.controller'
import { SearchNcmController } from './http/controllers/ncm-utilities/search-ncm.controller'
import { ValidarPecasNcmController } from './http/controllers/ncm-utilities/validar-pecas-ncm.controller'

@Module({
  controllers: [
    ListNcmsController,
    SearchNcmController,
    DiagnoseNcmLimitController,
    CompareNcmQueriesController,
    FinalNcmValidationController,
    ValidarPecasNcmController,
  ],
  providers: [
    ListNcmsUseCase,
    SearchNcmUseCase,
    DiagnoseNcmLimitUseCase,
    CompareNcmQueriesUseCase,
    FinalNcmValidationUseCase,
    ValidarPecasNcmUseCase,
    { provide: NcmUtilitiesRepository, useClass: PrismaNcmUtilitiesRepository },
  ],
})
export class NcmUtilitiesModule {}
