import { Module } from '@nestjs/common'
import { PrecificadorRepository } from '../domain/precificador/application/repositories/precificador-repository'
import { AtualizarPrecosUseCase } from '../domain/precificador/application/use-cases/atualizar-precos'
import { AtualizarPrecosLoteUseCase } from '../domain/precificador/application/use-cases/atualizar-precos-lote'
import { BuscarFornecedorUseCase } from '../domain/precificador/application/use-cases/buscar-fornecedor'
import { BuscarNcmPrecificadorUseCase } from '../domain/precificador/application/use-cases/buscar-ncm'
import { BuscarNfUseCase } from '../domain/precificador/application/use-cases/buscar-nf'
import { BuscarNfImportacaoUseCase } from '../domain/precificador/application/use-cases/buscar-nf-importacao'
import { BuscarProdutoUseCase } from '../domain/precificador/application/use-cases/buscar-produto'
import { ListarHistoricoUseCase } from '../domain/precificador/application/use-cases/listar-historico'
import { SalvarPrecificacaoUseCase } from '../domain/precificador/application/use-cases/salvar-precificacao'
import { PrismaPrecificadorRepository } from './database/prisma/repositories/prisma-precificador-repository'
import { AtualizarPrecosController } from './http/controllers/precificador/atualizar-precos.controller'
import { AtualizarPrecosLoteController } from './http/controllers/precificador/atualizar-precos-lote.controller'
import { BuscarFornecedorController } from './http/controllers/precificador/buscar-fornecedor.controller'
import { BuscarNcmController } from './http/controllers/precificador/buscar-ncm.controller'
import { BuscarNfController } from './http/controllers/precificador/buscar-nf.controller'
import { BuscarNfImportacaoController } from './http/controllers/precificador/buscar-nf-importacao.controller'
import { BuscarProdutoController } from './http/controllers/precificador/buscar-produto.controller'
import { ListarHistoricoController } from './http/controllers/precificador/listar-historico.controller'
import { SalvarPrecificacaoController } from './http/controllers/precificador/salvar-precificacao.controller'

@Module({
  controllers: [
    BuscarProdutoController,
    BuscarNcmController,
    BuscarFornecedorController,
    BuscarNfController,
    BuscarNfImportacaoController,
    ListarHistoricoController,
    SalvarPrecificacaoController,
    AtualizarPrecosController,
    AtualizarPrecosLoteController,
  ],
  providers: [
    BuscarProdutoUseCase,
    BuscarNcmPrecificadorUseCase,
    BuscarFornecedorUseCase,
    BuscarNfUseCase,
    BuscarNfImportacaoUseCase,
    ListarHistoricoUseCase,
    SalvarPrecificacaoUseCase,
    AtualizarPrecosUseCase,
    AtualizarPrecosLoteUseCase,
    { provide: PrecificadorRepository, useClass: PrismaPrecificadorRepository },
  ],
})
export class PrecificadorModule {}
