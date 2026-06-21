import { Module } from '@nestjs/common'
import { DebugNcmFormatUseCase } from '../domain/debug/application/use-cases/debug-ncm-format'
import { DebugNcmUseCase } from '../domain/debug/application/use-cases/debug-ncm'
import { DebugPermissionsUseCase } from '../domain/debug/application/use-cases/debug-permissions'
import { DebugUsuariosUseCase } from '../domain/debug/application/use-cases/debug-usuarios'
import { DebugNcmFormatController } from './http/controllers/debug/debug-ncm-format.controller'
import { DebugNcmController } from './http/controllers/debug/debug-ncm.controller'
import { DebugPermissionsController } from './http/controllers/debug/debug-permissions.controller'
import { DebugUsuariosController } from './http/controllers/debug/debug-usuarios.controller'

@Module({
  controllers: [
    DebugPermissionsController,
    DebugNcmController,
    DebugNcmFormatController,
    DebugUsuariosController,
  ],
  providers: [
    DebugPermissionsUseCase,
    DebugNcmUseCase,
    DebugNcmFormatUseCase,
    DebugUsuariosUseCase,
  ],
})
export class DebugModule {}
