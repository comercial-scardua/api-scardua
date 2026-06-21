import { Module } from '@nestjs/common'
import { ContaCorrenteRepository } from '../domain/conta-corrente/application/repositories/conta-corrente-repository'
import { AtualizarLancamentoContaUseCase } from '../domain/conta-corrente/application/use-cases/atualizar-lancamento-conta'
import { CreateContaCorrenteUseCase } from '../domain/conta-corrente/application/use-cases/create-conta-corrente'
import { CriarLancamentoContaUseCase } from '../domain/conta-corrente/application/use-cases/criar-lancamento-conta'
import { ExcluirContaCorrenteUseCase } from '../domain/conta-corrente/application/use-cases/excluir-conta-corrente'
import { ExcluirLancamentoContaUseCase } from '../domain/conta-corrente/application/use-cases/excluir-lancamento-conta'
import { FetchAllContasUseCase } from '../domain/conta-corrente/application/use-cases/fetch-all-contas'
import { FetchContasByUserUseCase } from '../domain/conta-corrente/application/use-cases/fetch-contas-by-user'
import { GenerateTermoContaUseCase } from '../domain/conta-corrente/application/use-cases/generate-termo-conta'
import { GetContaCorrenteUseCase } from '../domain/conta-corrente/application/use-cases/get-conta-corrente'
import { GetContaCorrenteStatsUseCase } from '../domain/conta-corrente/application/use-cases/get-conta-corrente-stats'
import { GetResumoContaUseCase } from '../domain/conta-corrente/application/use-cases/get-resumo-conta'
import { ToggleOcultoContaUseCase } from '../domain/conta-corrente/application/use-cases/toggle-oculto-conta'
import { UpdateContaCorrenteUseCase } from '../domain/conta-corrente/application/use-cases/update-conta-corrente'
import { PrismaContaCorrenteRepository } from './database/prisma/repositories/prisma-conta-corrente-repository'
import { AtualizarLancamentoController } from './http/controllers/conta-corrente/atualizar-lancamento.controller'
import { CreateContaCorrenteController } from './http/controllers/conta-corrente/create-conta-corrente.controller'
import { CreateContaForUsuarioController } from './http/controllers/conta-corrente/create-conta-for-usuario.controller'
import { CreateContaViaTodosController } from './http/controllers/conta-corrente/create-conta-via-todos.controller'
import { CriarLancamentoController } from './http/controllers/conta-corrente/criar-lancamento.controller'
import { ExcluirContaCorrenteController } from './http/controllers/conta-corrente/excluir-conta-corrente.controller'
import { ExcluirLancamentoController } from './http/controllers/conta-corrente/excluir-lancamento.controller'
import { FetchContasByUsuarioController } from './http/controllers/conta-corrente/fetch-contas-by-usuario.controller'
import { FetchMinhasContasController } from './http/controllers/conta-corrente/fetch-minhas-contas.controller'
import { FetchTodasContasController } from './http/controllers/conta-corrente/fetch-todas-contas.controller'
import { GenerateTermoController } from './http/controllers/conta-corrente/generate-termo.controller'
import { GetContaCorrenteController } from './http/controllers/conta-corrente/get-conta-corrente.controller'
import { GetResumoController } from './http/controllers/conta-corrente/get-resumo.controller'
import { GetResumoPostController } from './http/controllers/conta-corrente/get-resumo-post.controller'
import { GetStatsController } from './http/controllers/conta-corrente/get-stats.controller'
import { OcultarContaController } from './http/controllers/conta-corrente/ocultar-conta.controller'
import { ToggleOcultoController } from './http/controllers/conta-corrente/toggle-oculto.controller'
import { UpdateContaCorrenteController } from './http/controllers/conta-corrente/update-conta-corrente.controller'
import { UpdateContaForUsuarioController } from './http/controllers/conta-corrente/update-conta-for-usuario.controller'
import { UpdateContaViaTodosController } from './http/controllers/conta-corrente/update-conta-via-todos.controller'

@Module({
  controllers: [
    // Static routes first
    GetStatsController,
    FetchMinhasContasController,
    FetchTodasContasController,
    CreateContaViaTodosController,
    UpdateContaViaTodosController,
    OcultarContaController,
    GenerateTermoController,
    FetchContasByUsuarioController,
    CreateContaForUsuarioController,
    UpdateContaForUsuarioController,
    GetResumoController,
    GetResumoPostController,
    CreateContaCorrenteController,
    // Parametric routes after
    GetContaCorrenteController,
    UpdateContaCorrenteController,
    ToggleOcultoController,
    ExcluirContaCorrenteController,
    CriarLancamentoController,
    AtualizarLancamentoController,
    ExcluirLancamentoController,
  ],
  providers: [
    GetContaCorrenteStatsUseCase,
    FetchContasByUserUseCase,
    FetchAllContasUseCase,
    CreateContaCorrenteUseCase,
    UpdateContaCorrenteUseCase,
    GetContaCorrenteUseCase,
    ExcluirContaCorrenteUseCase,
    ToggleOcultoContaUseCase,
    GetResumoContaUseCase,
    GenerateTermoContaUseCase,
    CriarLancamentoContaUseCase,
    AtualizarLancamentoContaUseCase,
    ExcluirLancamentoContaUseCase,
    {
      provide: ContaCorrenteRepository,
      useClass: PrismaContaCorrenteRepository,
    },
  ],
})
export class ContaCorrenteModule {}
