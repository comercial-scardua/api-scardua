import { Module } from '@nestjs/common';
import { EmpresasController } from './empresas.controller';
import { EmpresasRepository } from './repositories/empresas.repository';
import { PrismaEmpresasRepository } from './repositories/prisma-empresas.repository';
import { AtualizarEmpresaUseCase } from './use-cases/atualizar-empresa.use-case';
import { BuscarEmpresaUseCase } from './use-cases/buscar-empresa.use-case';
import { CriarEmpresaUseCase } from './use-cases/criar-empresa.use-case';
import { DesativarEmpresaUseCase } from './use-cases/desativar-empresa.use-case';
import { ListarEmpresasUseCase } from './use-cases/listar-empresas.use-case';

@Module({
  controllers: [EmpresasController],
  providers: [
    {
      provide: EmpresasRepository,
      useClass: PrismaEmpresasRepository,
    },
    ListarEmpresasUseCase,
    BuscarEmpresaUseCase,
    CriarEmpresaUseCase,
    AtualizarEmpresaUseCase,
    DesativarEmpresaUseCase,
  ],
})
export class EmpresasModule {}
