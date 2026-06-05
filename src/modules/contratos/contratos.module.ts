import { Module } from '@nestjs/common';
import { ContratosController } from './contratos.controller';
import { ContratosRepository } from './repositories/contratos.repository';
import { PrismaContratosRepository } from './repositories/prisma-contratos.repository';
import { AcaoContratoUseCase } from './use-cases/acao-contrato.use-case';
import { AtualizarContratoUseCase } from './use-cases/atualizar-contrato.use-case';
import { BuscarContratoUseCase } from './use-cases/buscar-contrato.use-case';
import { CriarContratoUseCase } from './use-cases/criar-contrato.use-case';
import { ExcluirContratoUseCase } from './use-cases/excluir-contrato.use-case';
import { GerenciarArquivoContratoUseCase } from './use-cases/gerenciar-arquivo-contrato.use-case';

@Module({
  controllers: [ContratosController],
  providers: [
    { provide: ContratosRepository, useClass: PrismaContratosRepository },
    BuscarContratoUseCase,
    CriarContratoUseCase,
    AtualizarContratoUseCase,
    AcaoContratoUseCase,
    ExcluirContratoUseCase,
    GerenciarArquivoContratoUseCase,
  ],
})
export class ContratosModule {}
