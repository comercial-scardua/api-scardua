import { Module } from '@nestjs/common';
import { EstoqueController } from './estoque.controller';
import { EstoqueRepository } from './repositories/estoque.repository';
import { PrismaEstoqueRepository } from './repositories/prisma-estoque.repository';
import { CriarProdutoUseCase } from './use-cases/criar-produto.use-case';
import { CriarSaidaUseCase } from './use-cases/criar-saida.use-case';
import { CriarTransferenciaUseCase } from './use-cases/criar-transferencia.use-case';

@Module({
  controllers: [EstoqueController],
  providers: [
    { provide: EstoqueRepository, useClass: PrismaEstoqueRepository },
    CriarProdutoUseCase,
    CriarSaidaUseCase,
    CriarTransferenciaUseCase,
  ],
})
export class EstoqueModule {}
