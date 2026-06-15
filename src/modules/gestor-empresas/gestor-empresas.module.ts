import { Module } from '@nestjs/common';
import { GestorEmpresasController } from './gestor-empresas.controller';
import { GestorEmpresasRepository } from './repositories/gestor-empresas.repository';

@Module({
  controllers: [GestorEmpresasController],
  providers: [GestorEmpresasRepository],
})
export class GestorEmpresasModule {}
