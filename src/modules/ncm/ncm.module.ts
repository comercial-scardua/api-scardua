import { Module } from '@nestjs/common';
import { NcmController } from './ncm.controller';
import { NcmRepository } from './repositories/ncm.repository';
import { PrismaNcmRepository } from './repositories/prisma-ncm.repository';
import { AtualizarNcmUseCase } from './use-cases/atualizar-ncm.use-case';
import { BuscarNcmUseCase } from './use-cases/buscar-ncm.use-case';
import { CriarNcmUseCase } from './use-cases/criar-ncm.use-case';
import { DesativarNcmUseCase } from './use-cases/desativar-ncm.use-case';
import { ImportarNcmUseCase } from './use-cases/importar-ncm.use-case';
import { ListarNcmUseCase } from './use-cases/listar-ncm.use-case';

@Module({
  controllers: [NcmController],
  providers: [
    { provide: NcmRepository, useClass: PrismaNcmRepository },
    ListarNcmUseCase,
    BuscarNcmUseCase,
    CriarNcmUseCase,
    AtualizarNcmUseCase,
    DesativarNcmUseCase,
    ImportarNcmUseCase,
  ],
})
export class NcmModule {}
