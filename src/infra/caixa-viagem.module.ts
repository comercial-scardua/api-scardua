import { Module } from '@nestjs/common'
import { CaixaViagemRepository } from '../domain/caixa-viagem/application/repositories/caixa-viagem-repository'
import { AtualizarAdiantamentoUseCase } from '../domain/caixa-viagem/application/use-cases/atualizar-adiantamento'
import { CreateCaixaViagemUseCase } from '../domain/caixa-viagem/application/use-cases/create-caixa-viagem'
import { CriarAdiantamentoUseCase } from '../domain/caixa-viagem/application/use-cases/criar-adiantamento'
import { ExcluirAdiantamentoUseCase } from '../domain/caixa-viagem/application/use-cases/excluir-adiantamento'
import { ExcluirCaixaViagemUseCase } from '../domain/caixa-viagem/application/use-cases/excluir-caixa-viagem'
import { FetchAdiantamentosUseCase } from '../domain/caixa-viagem/application/use-cases/fetch-adiantamentos'
import { FetchAllCaixasViagemUseCase } from '../domain/caixa-viagem/application/use-cases/fetch-all-caixas-viagem'
import { FetchCaixasViagemByUserUseCase } from '../domain/caixa-viagem/application/use-cases/fetch-caixas-viagem-by-user'
import { FindUltimoCaixaFuncionarioUseCase } from '../domain/caixa-viagem/application/use-cases/find-ultimo-caixa-funcionario'
import { GenerateTermoCaixaViagemUseCase } from '../domain/caixa-viagem/application/use-cases/generate-termo-caixa-viagem'
import { GetCaixaViagemStatsUseCase } from '../domain/caixa-viagem/application/use-cases/get-caixa-viagem-stats'
import { GetResumoCaixaViagemUseCase } from '../domain/caixa-viagem/application/use-cases/get-resumo-caixa-viagem'
import { RecalcularSaldosCaixaViagemUseCase } from '../domain/caixa-viagem/application/use-cases/recalcular-saldos-caixa-viagem'
import { ToggleOcultoCaixaViagemUseCase } from '../domain/caixa-viagem/application/use-cases/toggle-oculto-caixa-viagem'
import { UpdateCaixaViagemUseCase } from '../domain/caixa-viagem/application/use-cases/update-caixa-viagem'
import { UpdateUltimoCaixaFuncionarioUseCase } from '../domain/caixa-viagem/application/use-cases/update-ultimo-caixa-funcionario'
import { PrismaCaixaViagemRepository } from './database/prisma/repositories/prisma-caixa-viagem-repository'
import { AtualizarAdiantamentoController } from './http/controllers/caixa-viagem/atualizar-adiantamento.controller'
import { CreateCaixaViagemController } from './http/controllers/caixa-viagem/create-caixa-viagem.controller'
import { CreateParaFuncionarioController } from './http/controllers/caixa-viagem/create-para-funcionario.controller'
import { CreateParaUsuarioController } from './http/controllers/caixa-viagem/create-para-usuario.controller'
import { CreateTodosController } from './http/controllers/caixa-viagem/create-todos.controller'
import { CriarAdiantamentoController } from './http/controllers/caixa-viagem/criar-adiantamento.controller'
import { ExcluirAdiantamentoController } from './http/controllers/caixa-viagem/excluir-adiantamento.controller'
import { ExcluirCaixaViagemController } from './http/controllers/caixa-viagem/excluir-caixa-viagem.controller'
import { FetchAdiantamentosController } from './http/controllers/caixa-viagem/fetch-adiantamentos.controller'
import { FetchAllTodosController } from './http/controllers/caixa-viagem/fetch-all-todos.controller'
import { FetchByUsuarioController } from './http/controllers/caixa-viagem/fetch-by-usuario.controller'
import { FetchMinhasCaixasController } from './http/controllers/caixa-viagem/fetch-minhas-caixas.controller'
import { FindUltimoCaixaController } from './http/controllers/caixa-viagem/find-ultimo-caixa.controller'
import { GenerateTermoController } from './http/controllers/caixa-viagem/generate-termo.controller'
import { GetResumoController } from './http/controllers/caixa-viagem/get-resumo.controller'
import { GetStatsController } from './http/controllers/caixa-viagem/get-stats.controller'
import { RecalcularSaldosController } from './http/controllers/caixa-viagem/recalcular-saldos.controller'
import { ToggleOcultoController } from './http/controllers/caixa-viagem/toggle-oculto.controller'
import { UpdateParaUsuarioController } from './http/controllers/caixa-viagem/update-para-usuario.controller'
import { UpdateTodosController } from './http/controllers/caixa-viagem/update-todos.controller'
import { UpdateUltimoCaixaController } from './http/controllers/caixa-viagem/update-ultimo-caixa.controller'

@Module({
  controllers: [
    // Static routes (MUST come before parametric routes)
    GetStatsController,
    FetchAllTodosController,
    CreateTodosController,
    UpdateTodosController,
    FindUltimoCaixaController,
    CreateParaFuncionarioController,
    UpdateUltimoCaixaController,
    FetchByUsuarioController,
    CreateParaUsuarioController,
    UpdateParaUsuarioController,
    GetResumoController,
    GenerateTermoController,
    RecalcularSaldosController,
    ToggleOcultoController,
    FetchAdiantamentosController,
    CriarAdiantamentoController,
    AtualizarAdiantamentoController,
    ExcluirAdiantamentoController,
    // Parametric routes (MUST come after static routes)
    FetchMinhasCaixasController,
    CreateCaixaViagemController,
    ExcluirCaixaViagemController,
  ],
  providers: [
    GetCaixaViagemStatsUseCase,
    FetchAllCaixasViagemUseCase,
    CreateCaixaViagemUseCase,
    UpdateCaixaViagemUseCase,
    FindUltimoCaixaFuncionarioUseCase,
    UpdateUltimoCaixaFuncionarioUseCase,
    FetchCaixasViagemByUserUseCase,
    GetResumoCaixaViagemUseCase,
    GenerateTermoCaixaViagemUseCase,
    RecalcularSaldosCaixaViagemUseCase,
    ToggleOcultoCaixaViagemUseCase,
    ExcluirCaixaViagemUseCase,
    FetchAdiantamentosUseCase,
    CriarAdiantamentoUseCase,
    AtualizarAdiantamentoUseCase,
    ExcluirAdiantamentoUseCase,
    { provide: CaixaViagemRepository, useClass: PrismaCaixaViagemRepository },
  ],
})
export class CaixaViagemModule {}
