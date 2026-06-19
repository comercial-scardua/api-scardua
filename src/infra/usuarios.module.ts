import { Module } from '@nestjs/common'
import { UsuariosRepository } from '../domain/usuarios/application/repositories/usuarios-repository'
import { CheckUsuarioPermissionUseCase } from '../domain/usuarios/application/use-cases/check-usuario-permission'
import { CheckUsuarioPermissionDebugUseCase } from '../domain/usuarios/application/use-cases/check-usuario-permission-debug'
import { CreateUsuarioUseCase } from '../domain/usuarios/application/use-cases/create-usuario'
import { DeleteUsuarioUseCase } from '../domain/usuarios/application/use-cases/delete-usuario'
import { EditUsuarioUseCase } from '../domain/usuarios/application/use-cases/edit-usuario'
import { GetUsuarioUseCase } from '../domain/usuarios/application/use-cases/get-usuario'
import { GetUsuarioPermissionsUseCase } from '../domain/usuarios/application/use-cases/get-usuario-permissions'
import { ListUsuariosUseCase } from '../domain/usuarios/application/use-cases/list-usuarios'
import { SetUsuarioPermissionUseCase } from '../domain/usuarios/application/use-cases/set-usuario-permission'
import { UpdateFotoUsuarioUseCase } from '../domain/usuarios/application/use-cases/update-foto-usuario'
import { UpdateUsuarioPermissionsUseCase } from '../domain/usuarios/application/use-cases/update-usuario-permissions'
import { PrismaUsuariosRepository } from './database/prisma/repositories/prisma-usuarios-repository'
import { CreateUsuarioController } from './http/controllers/usuarios/create-usuario.controller'
import { DeleteUsuarioController } from './http/controllers/usuarios/delete-usuario.controller'
import { EditUsuarioController } from './http/controllers/usuarios/edit-usuario.controller'
import { GetUsuarioController } from './http/controllers/usuarios/get-usuario.controller'
import { ListUsuariosController } from './http/controllers/usuarios/list-usuarios.controller'
import { MeUsuarioController } from './http/controllers/usuarios/me-usuario.controller'
import { UpdateFotoUsuarioController } from './http/controllers/usuarios/update-foto-usuario.controller'
import { UsuarioPermissionsController } from './http/controllers/usuarios/usuario-permissions.controller'

@Module({
  controllers: [
    ListUsuariosController,
    MeUsuarioController,
    UsuarioPermissionsController,
    CreateUsuarioController,
    UpdateFotoUsuarioController,
    GetUsuarioController,
    EditUsuarioController,
    DeleteUsuarioController,
  ],
  providers: [
    ListUsuariosUseCase,
    GetUsuarioUseCase,
    CreateUsuarioUseCase,
    EditUsuarioUseCase,
    DeleteUsuarioUseCase,
    UpdateFotoUsuarioUseCase,
    CheckUsuarioPermissionUseCase,
    CheckUsuarioPermissionDebugUseCase,
    GetUsuarioPermissionsUseCase,
    SetUsuarioPermissionUseCase,
    UpdateUsuarioPermissionsUseCase,
    { provide: UsuariosRepository, useClass: PrismaUsuariosRepository },
  ],
})
export class UsuariosModule {}
