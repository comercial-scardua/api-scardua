import { Module } from '@nestjs/common';
import { PermissoesController } from './permissoes.controller';
import { PermissoesRepository } from './repositories/permissoes.repository';
import { PrismaPermissoesRepository } from './repositories/prisma-permissoes.repository';
import { DefinirPermissaoPaginaUseCase } from './use-cases/definir-permissao-pagina.use-case';
import { DefinirPermissoesUseCase } from './use-cases/definir-permissoes.use-case';
import { ListarPermissoesUseCase } from './use-cases/listar-permissoes.use-case';
import { RemoverPermissaoUseCase } from './use-cases/remover-permissao.use-case';

@Module({
  controllers: [PermissoesController],
  providers: [
    {
      provide: PermissoesRepository,
      useClass: PrismaPermissoesRepository,
    },
    ListarPermissoesUseCase,
    DefinirPermissoesUseCase,
    DefinirPermissaoPaginaUseCase,
    RemoverPermissaoUseCase,
  ],
})
export class PermissoesModule {}
