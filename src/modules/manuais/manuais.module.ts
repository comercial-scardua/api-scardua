import { Module } from '@nestjs/common';
import { ManuaisController } from './manuais.controller';
import { ManuaisRepository } from './repositories/manuais.repository';
import { PrismaManuaisRepository } from './repositories/prisma-manuais.repository';
import { AtualizarManualUseCase } from './use-cases/atualizar-manual.use-case';
import { BuscarManualUseCase } from './use-cases/buscar-manual.use-case';
import { CriarManualUseCase } from './use-cases/criar-manual.use-case';
import { DesativarManualUseCase } from './use-cases/desativar-manual.use-case';
import { GerenciarArquivoManualUseCase } from './use-cases/gerenciar-arquivo-manual.use-case';

@Module({
  controllers: [ManuaisController],
  providers: [
    { provide: ManuaisRepository, useClass: PrismaManuaisRepository },
    BuscarManualUseCase,
    CriarManualUseCase,
    AtualizarManualUseCase,
    DesativarManualUseCase,
    GerenciarArquivoManualUseCase,
  ],
})
export class ManuaisModule {}
