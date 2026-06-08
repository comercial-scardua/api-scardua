import { Module } from '@nestjs/common'
import { EpiController } from './epi.controller'
import { EpiRepository } from './repositories/epi.repository'
import { PrismaEpiRepository } from './repositories/prisma-epi.repository'
import { AtualizarCargoEpiUseCase } from './use-cases/atualizar-cargo-epi.use-case'
import { AtualizarEpiUseCase } from './use-cases/atualizar-epi.use-case'
import { AtualizarEstoqueMovimentacaoUseCase } from './use-cases/atualizar-estoque-movimentacao.use-case'
import { CriarCargoEpiLinkUseCase } from './use-cases/criar-cargo-epi-link.use-case'
import { CriarEstoqueMovimentacaoUseCase } from './use-cases/criar-estoque-movimentacao.use-case'
import { CriarMovimentacaoEpiUseCase } from './use-cases/criar-movimentacao-epi.use-case'
import { CriarTransferenciaEpiUseCase } from './use-cases/criar-transferencia-epi.use-case'
import { ExcluirCargoEpiUseCase } from './use-cases/excluir-cargo-epi.use-case'
import { ExcluirEpiUseCase } from './use-cases/excluir-epi.use-case'
import { ExcluirEstoqueMovimentacaoUseCase } from './use-cases/excluir-estoque-movimentacao.use-case'
import { ExcluirTransferenciaEpiUseCase } from './use-cases/excluir-transferencia-epi.use-case'
import { ListarColaboradoresEpiUseCase } from './use-cases/listar-colaboradores-epi.use-case'
import { RegistrarEntregaHistoricaUseCase } from './use-cases/registrar-entrega-historica.use-case'
import { ToggleStatusEpiUseCase } from './use-cases/toggle-status-epi.use-case'

@Module({
  controllers: [EpiController],
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
