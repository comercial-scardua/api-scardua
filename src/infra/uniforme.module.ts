import { Module } from '@nestjs/common'
import { UniformeRepository } from '../domain/uniforme/application/repositories/uniforme-repository'
import { CreateCargoUniformeUseCase } from '../domain/uniforme/application/use-cases/create-cargo-uniforme'
import { CreateDepartamentoUseCase } from '../domain/uniforme/application/use-cases/create-departamento'
import { CreateMovimentacaoUseCase } from '../domain/uniforme/application/use-cases/create-movimentacao'
import { CreateUniformeUseCase } from '../domain/uniforme/application/use-cases/create-uniforme'
import { DeleteCargoUniformeUseCase } from '../domain/uniforme/application/use-cases/delete-cargo-uniforme'
import { DeleteDepartamentoUseCase } from '../domain/uniforme/application/use-cases/delete-departamento'
import { EditUniformeUseCase } from '../domain/uniforme/application/use-cases/edit-uniforme'
import { GetPerfilUseCase } from '../domain/uniforme/application/use-cases/get-perfil'
import { ListCargoUniformeUseCase } from '../domain/uniforme/application/use-cases/list-cargo-uniforme'
import { ListColaboradoresUseCase } from '../domain/uniforme/application/use-cases/list-colaboradores'
import { ListDepartamentosUseCase } from '../domain/uniforme/application/use-cases/list-departamentos'
import { ListEmpresasUseCase } from '../domain/uniforme/application/use-cases/list-empresas'
import { ListMovimentacoesUseCase } from '../domain/uniforme/application/use-cases/list-movimentacoes'
import { ListResponsaveisUseCase } from '../domain/uniforme/application/use-cases/list-responsaveis'
import { ListUniformesUseCase } from '../domain/uniforme/application/use-cases/list-uniformes'
import { UpdateColaboradorUseCase } from '../domain/uniforme/application/use-cases/update-colaborador'
import { PrismaUniformeRepository } from './database/prisma/repositories/prisma-uniforme-repository'
import { CreateCargoUniformeController } from './http/controllers/uniforme/create-cargo-uniforme.controller'
import { CreateDepartamentoController } from './http/controllers/uniforme/create-departamento.controller'
import { CreateMovimentacaoController } from './http/controllers/uniforme/create-movimentacao.controller'
import { CreateUniformeController } from './http/controllers/uniforme/create-uniforme.controller'
import { DeleteCargoUniformeController } from './http/controllers/uniforme/delete-cargo-uniforme.controller'
import { DeleteDepartamentoController } from './http/controllers/uniforme/delete-departamento.controller'
import { EditUniformeController } from './http/controllers/uniforme/edit-uniforme.controller'
import { GetPerfilController } from './http/controllers/uniforme/get-perfil.controller'
import { ListCargoUniformeController } from './http/controllers/uniforme/list-cargo-uniforme.controller'
import { ListColaboradoresController } from './http/controllers/uniforme/list-colaboradores.controller'
import { ListDepartamentosController } from './http/controllers/uniforme/list-departamentos.controller'
import { ListEmpresasUniformeController } from './http/controllers/uniforme/list-empresas.controller'
import { ListMovimentacoesController } from './http/controllers/uniforme/list-movimentacoes.controller'
import { ListResponsaveisController } from './http/controllers/uniforme/list-responsaveis.controller'
import { ListUniformesController } from './http/controllers/uniforme/list-uniformes.controller'
import { UpdateColaboradorController } from './http/controllers/uniforme/update-colaborador.controller'

@Module({
  controllers: [
    ListUniformesController,
    CreateUniformeController,
    EditUniformeController,
    ListDepartamentosController,
    CreateDepartamentoController,
    DeleteDepartamentoController,
    ListCargoUniformeController,
    CreateCargoUniformeController,
    DeleteCargoUniformeController,
    ListColaboradoresController,
    UpdateColaboradorController,
    GetPerfilController,
    ListMovimentacoesController,
    CreateMovimentacaoController,
    ListEmpresasUniformeController,
    ListResponsaveisController,
  ],
  providers: [
    ListUniformesUseCase,
    CreateUniformeUseCase,
    EditUniformeUseCase,
    ListDepartamentosUseCase,
    CreateDepartamentoUseCase,
    DeleteDepartamentoUseCase,
    ListCargoUniformeUseCase,
    CreateCargoUniformeUseCase,
    DeleteCargoUniformeUseCase,
    ListColaboradoresUseCase,
    UpdateColaboradorUseCase,
    GetPerfilUseCase,
    ListMovimentacoesUseCase,
    CreateMovimentacaoUseCase,
    ListEmpresasUseCase,
    ListResponsaveisUseCase,
    { provide: UniformeRepository, useClass: PrismaUniformeRepository },
  ],
})
export class UniformeModule {}
