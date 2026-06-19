import { Module } from '@nestjs/common'
import { EstoqueController } from './estoque.controller'
import { EstoqueRepository } from './repositories/estoque.repository'
import { PrismaEstoqueRepository } from './repositories/prisma-estoque.repository'
import { AtualizarProdutoUseCase } from './use-cases/atualizar-produto.use-case'
import { CriarEntradaUseCase } from './use-cases/criar-entrada.use-case'
import { CriarProdutoUseCase } from './use-cases/criar-produto.use-case'
import { CriarSaidaUseCase } from './use-cases/criar-saida.use-case'
import { CriarTransferenciaUseCase } from './use-cases/criar-transferencia.use-case'
import { DesativarProdutoUseCase } from './use-cases/desativar-produto.use-case'

@Module({
  controllers: [EstoqueController],
  providers: [
    { provide: EstoqueRepository, useClass: PrismaEstoqueRepository },
    CriarProdutoUseCase,
    AtualizarProdutoUseCase,
    DesativarProdutoUseCase,
    CriarEntradaUseCase,
    CriarSaidaUseCase,
    CriarTransferenciaUseCase,
  ],
})
export class EstoqueModule {}
