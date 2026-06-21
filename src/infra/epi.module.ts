import { Module } from '@nestjs/common'
import { EpiRepository } from '../domain/epi/application/repositories/epi-repository'
import { AtualizarCargoEpiUseCase } from '../domain/epi/application/use-cases/atualizar-cargo-epi'
import { AtualizarEpiUseCase } from '../domain/epi/application/use-cases/atualizar-epi'
import { AtualizarEstoqueMovimentacaoUseCase } from '../domain/epi/application/use-cases/atualizar-estoque-movimentacao'
import { CriarCargoEpiLinkUseCase } from '../domain/epi/application/use-cases/criar-cargo-epi-link'
import { CriarEstoqueMovimentacaoUseCase } from '../domain/epi/application/use-cases/criar-estoque-movimentacao'
import { CriarMovimentacaoEpiUseCase } from '../domain/epi/application/use-cases/criar-movimentacao-epi'
import { CriarTransferenciaEpiUseCase } from '../domain/epi/application/use-cases/criar-transferencia-epi'
import { ExcluirCargoEpiUseCase } from '../domain/epi/application/use-cases/excluir-cargo-epi'
import { ExcluirEpiUseCase } from '../domain/epi/application/use-cases/excluir-epi'
import { ExcluirEstoqueMovimentacaoUseCase } from '../domain/epi/application/use-cases/excluir-estoque-movimentacao'
import { ExcluirTransferenciaEpiUseCase } from '../domain/epi/application/use-cases/excluir-transferencia-epi'
import { ListarColaboradoresEpiUseCase } from '../domain/epi/application/use-cases/listar-colaboradores-epi'
import { RegistrarEntregaHistoricaUseCase } from '../domain/epi/application/use-cases/registrar-entrega-historica'
import { ToggleStatusEpiUseCase } from '../domain/epi/application/use-cases/toggle-status-epi'
import { PrismaEpiRepository } from './database/prisma/repositories/prisma-epi-repository'
// Static route controllers (registered FIRST — order matters for NestJS route matching)
import { CreateCargoController } from './http/controllers/epi/create-cargo.controller'
import { CreateCargoEpiLinkController } from './http/controllers/epi/create-cargo-epi-link.controller'
import { CreateEpiController } from './http/controllers/epi/create-epi.controller'
import { CreateEstoqueMovimentacaoController } from './http/controllers/epi/create-estoque-movimentacao.controller'
import { CreateMovimentacaoController } from './http/controllers/epi/create-movimentacao.controller'
// Parametric route controllers (registered AFTER static routes)
import { CreateMovimentacaoForColaboradorController } from './http/controllers/epi/create-movimentacao-for-colaborador.controller'
import { CreateTransferenciaController } from './http/controllers/epi/create-transferencia.controller'
import { DeleteCargoController } from './http/controllers/epi/delete-cargo.controller'
import { DeleteCargoEpiLinkController } from './http/controllers/epi/delete-cargo-epi-link.controller'
import { DeleteEpiController } from './http/controllers/epi/delete-epi.controller'
import { DeleteEstoqueMovimentacaoController } from './http/controllers/epi/delete-estoque-movimentacao.controller'
import { DeleteTransferenciaController } from './http/controllers/epi/delete-transferencia.controller'
import { FindAllCargosController } from './http/controllers/epi/find-all-cargos.controller'
import { FindAllEpisController } from './http/controllers/epi/find-all-epis.controller'
import { FindCargoEpiLinksController } from './http/controllers/epi/find-cargo-epi-links.controller'
import { FindColaboradoresController } from './http/controllers/epi/find-colaboradores.controller'
import { FindEmpresasController } from './http/controllers/epi/find-empresas.controller'
import { FindEstoqueController } from './http/controllers/epi/find-estoque.controller'
import { FindMovimentacoesController } from './http/controllers/epi/find-movimentacoes.controller'
import { FindMovimentacoesByColaboradorController } from './http/controllers/epi/find-movimentacoes-by-colaborador.controller'
import { FindProdutosController } from './http/controllers/epi/find-produtos.controller'
import { FindResponsaveisController } from './http/controllers/epi/find-responsaveis.controller'
import { FindSaldoFiliaisController } from './http/controllers/epi/find-saldo-filiais.controller'
import { FindTransferenciasController } from './http/controllers/epi/find-transferencias.controller'
import { GetAlertasController } from './http/controllers/epi/get-alertas.controller'
import { GetCargoController } from './http/controllers/epi/get-cargo.controller'
import { GetCargoEpiLinkController } from './http/controllers/epi/get-cargo-epi-link.controller'
import { GetColaboradorController } from './http/controllers/epi/get-colaborador.controller'
import { GetDashboardController } from './http/controllers/epi/get-dashboard.controller'
import { GetEpiController } from './http/controllers/epi/get-epi.controller'
import { GetEstoqueMovimentacaoController } from './http/controllers/epi/get-estoque-movimentacao.controller'
import { GetMeController } from './http/controllers/epi/get-me.controller'
import { GetTransferenciaController } from './http/controllers/epi/get-transferencia.controller'
import { RegistrarEntregaHistoricaController } from './http/controllers/epi/registrar-entrega-historica.controller'
import { ToggleStatusEpiController } from './http/controllers/epi/toggle-status-epi.controller'
import { UpdateCargoController } from './http/controllers/epi/update-cargo.controller'
import { UpdateColaboradorController } from './http/controllers/epi/update-colaborador.controller'
import { UpdateEpiController } from './http/controllers/epi/update-epi.controller'
import { UpdateEstoqueMovimentacaoController } from './http/controllers/epi/update-estoque-movimentacao.controller'

@Module({
  controllers: [
    // Static routes FIRST
    GetMeController,
    FindAllEpisController,
    CreateEpiController,
    FindAllCargosController,
    CreateCargoController,
    FindCargoEpiLinksController,
    CreateCargoEpiLinkController,
    FindColaboradoresController,
    FindMovimentacoesController,
    CreateMovimentacaoController,
    RegistrarEntregaHistoricaController,
    FindEstoqueController,
    CreateEstoqueMovimentacaoController,
    FindSaldoFiliaisController,
    FindProdutosController,
    FindEmpresasController,
    FindResponsaveisController,
    GetDashboardController,
    GetAlertasController,
    FindTransferenciasController,
    CreateTransferenciaController,
    // Parametric routes AFTER
    GetEpiController,
    UpdateEpiController,
    DeleteEpiController,
    ToggleStatusEpiController,
    GetCargoController,
    UpdateCargoController,
    DeleteCargoController,
    GetCargoEpiLinkController,
    DeleteCargoEpiLinkController,
    GetColaboradorController,
    UpdateColaboradorController,
    FindMovimentacoesByColaboradorController,
    CreateMovimentacaoForColaboradorController,
    GetEstoqueMovimentacaoController,
    UpdateEstoqueMovimentacaoController,
    DeleteEstoqueMovimentacaoController,
    GetTransferenciaController,
    DeleteTransferenciaController,
  ],
  providers: [
    { provide: EpiRepository, useClass: PrismaEpiRepository },
    AtualizarEpiUseCase,
    ExcluirEpiUseCase,
    ToggleStatusEpiUseCase,
    AtualizarCargoEpiUseCase,
    ExcluirCargoEpiUseCase,
    CriarCargoEpiLinkUseCase,
    ListarColaboradoresEpiUseCase,
    CriarMovimentacaoEpiUseCase,
    RegistrarEntregaHistoricaUseCase,
    CriarEstoqueMovimentacaoUseCase,
    AtualizarEstoqueMovimentacaoUseCase,
    ExcluirEstoqueMovimentacaoUseCase,
    CriarTransferenciaEpiUseCase,
    ExcluirTransferenciaEpiUseCase,
  ],
})
export class EpiModule {}
