import { Module } from '@nestjs/common';
import { PrismaUsuariosRepository } from './repositories/prisma-usuarios.repository';
import { UsuariosRepository } from './repositories/usuarios.repository';
import { AtualizarUsuarioUseCase } from './use-cases/atualizar-usuario.use-case';
import { BuscarUsuarioUseCase } from './use-cases/buscar-usuario.use-case';
import { CriarUsuarioUseCase } from './use-cases/criar-usuario.use-case';
import { DesativarUsuarioUseCase } from './use-cases/desativar-usuario.use-case';
import { ListarUsuariosUseCase } from './use-cases/listar-usuarios.use-case';
import { UsuariosController } from './usuarios.controller';

@Module({
  controllers: [UsuariosController],
  providers: [
    {
      provide: UsuariosRepository,
      useClass: PrismaUsuariosRepository,
    },
    ListarUsuariosUseCase,
    BuscarUsuarioUseCase,
    CriarUsuarioUseCase,
    AtualizarUsuarioUseCase,
    DesativarUsuarioUseCase,
  ],
})
export class UsuariosModule {}
