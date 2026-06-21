import { Module } from '@nestjs/common'
import { EstoqueRepository } from '../domain/estoque/application/repositories/estoque-repository'
import { AtualizarProdutoUseCase } from '../domain/estoque/application/use-cases/atualizar-produto'
import { CriarEntradaUseCase } from '../domain/estoque/application/use-cases/criar-entrada'
import { CriarProdutoUseCase } from '../domain/estoque/application/use-cases/criar-produto'
import { CriarSaidaUseCase } from '../domain/estoque/application/use-cases/criar-saida'
import { CriarTransferenciaUseCase } from '../domain/estoque/application/use-cases/criar-transferencia'
import { DesativarProdutoUseCase } from '../domain/estoque/application/use-cases/desativar-produto'
import { ExcluirEntradaUseCase } from '../domain/estoque/application/use-cases/excluir-entrada'
import { ExcluirSaidaUseCase } from '../domain/estoque/application/use-cases/excluir-saida'
import { FetchEmpresasEstoqueUseCase } from '../domain/estoque/application/use-cases/fetch-empresas-estoque'
import { FetchEntradasUseCase } from '../domain/estoque/application/use-cases/fetch-entradas'
import { FetchProdutosUseCase } from '../domain/estoque/application/use-cases/fetch-produtos'
import { FetchSaidasUseCase } from '../domain/estoque/application/use-cases/fetch-saidas'
import { FetchTransferenciasUseCase } from '../domain/estoque/application/use-cases/fetch-transferencias'
import { GetDashboardUseCase } from '../domain/estoque/application/use-cases/get-dashboard'
import { GetEntradaUseCase } from '../domain/estoque/application/use-cases/get-entrada'
import { GetProdutoUseCase } from '../domain/estoque/application/use-cases/get-produto'
import { GetSaidaUseCase } from '../domain/estoque/application/use-cases/get-saida'
import { GetSaldoFiliaisUseCase } from '../domain/estoque/application/use-cases/get-saldo-filiais'
import { GetTransferenciaUseCase } from '../domain/estoque/application/use-cases/get-transferencia'
import { UpdateEntradaUseCase } from '../domain/estoque/application/use-cases/update-entrada'
import { UpdateSaidaUseCase } from '../domain/estoque/application/use-cases/update-saida'
import { UpdateTransferenciaUseCase } from '../domain/estoque/application/use-cases/update-transferencia'
import { PrismaEstoqueRepository } from './database/prisma/repositories/prisma-estoque-repository'
import { CreateEntradaController } from './http/controllers/estoque/create-entrada.controller'
import { CreateProdutoController } from './http/controllers/estoque/create-produto.controller'
import { CreateSaidaController } from './http/controllers/estoque/create-saida.controller'
import { CreateTransferenciaController } from './http/controllers/estoque/create-transferencia.controller'
import { DeleteEntradaController } from './http/controllers/estoque/delete-entrada.controller'
import { DeleteProdutoController } from './http/controllers/estoque/delete-produto.controller'
import { DeleteSaidaController } from './http/controllers/estoque/delete-saida.controller'
import { FetchEmpresasEstoqueController } from './http/controllers/estoque/fetch-empresas-estoque.controller'
import { FetchEntradasController } from './http/controllers/estoque/fetch-entradas.controller'
import { FetchProdutosController } from './http/controllers/estoque/fetch-produtos.controller'
import { FetchSaidasController } from './http/controllers/estoque/fetch-saidas.controller'
import { FetchTransferenciasController } from './http/controllers/estoque/fetch-transferencias.controller'
import { GetDashboardController } from './http/controllers/estoque/get-dashboard.controller'
import { GetEntradaController } from './http/controllers/estoque/get-entrada.controller'
import { GetProdutoController } from './http/controllers/estoque/get-produto.controller'
import { GetSaidaController } from './http/controllers/estoque/get-saida.controller'
import { GetSaldoFiliaisController } from './http/controllers/estoque/get-saldo-filiais.controller'
import { GetTransferenciaController } from './http/controllers/estoque/get-transferencia.controller'
import { UpdateEntradaController } from './http/controllers/estoque/update-entrada.controller'
import { UpdateProdutoController } from './http/controllers/estoque/update-produto.controller'
import { UpdateSaidaController } from './http/controllers/estoque/update-saida.controller'
import { UpdateTransferenciaController } from './http/controllers/estoque/update-transferencia.controller'

@Module({
  controllers: [
    // Static routes FIRST
    GetDashboardController,
    GetSaldoFiliaisController,
    FetchEmpresasEstoqueController,
    FetchProdutosController,
    CreateProdutoController,
    FetchEntradasController,
    CreateEntradaController,
    FetchSaidasController,
    CreateSaidaController,
    FetchTransferenciasController,
    CreateTransferenciaController,
    // Parametric routes AFTER
    GetProdutoController,
    UpdateProdutoController,
    DeleteProdutoController,
    GetEntradaController,
    UpdateEntradaController,
    DeleteEntradaController,
    GetSaidaController,
    UpdateSaidaController,
    DeleteSaidaController,
    GetTransferenciaController,
    UpdateTransferenciaController,
  ],
  providers: [
    { provide: EstoqueRepository, useClass: PrismaEstoqueRepository },
    GetDashboardUseCase,
    GetSaldoFiliaisUseCase,
    FetchEmpresasEstoqueUseCase,
    FetchProdutosUseCase,
    CriarProdutoUseCase,
    AtualizarProdutoUseCase,
    DesativarProdutoUseCase,
    GetProdutoUseCase,
    FetchEntradasUseCase,
    CriarEntradaUseCase,
    GetEntradaUseCase,
    UpdateEntradaUseCase,
    ExcluirEntradaUseCase,
    FetchSaidasUseCase,
    CriarSaidaUseCase,
    GetSaidaUseCase,
    UpdateSaidaUseCase,
    ExcluirSaidaUseCase,
    FetchTransferenciasUseCase,
    CriarTransferenciaUseCase,
    GetTransferenciaUseCase,
    UpdateTransferenciaUseCase,
  ],
})
export class EstoqueModule {}
