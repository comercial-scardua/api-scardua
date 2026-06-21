import { Controller, Get, HttpCode, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { DebugUsuariosUseCase } from '../../../../domain/debug/application/use-cases/debug-usuarios'

@ApiTags('Debug')
@ApiBearerAuth()
@Controller('')
@UseGuards(PermissionsGuard)
export class DebugUsuariosController {
  constructor(private debugUsuarios: DebugUsuariosUseCase) {}

  @Get('debug-usuarios')
  @HttpCode(200)
  @RequirePermission('debug', 'access')
  @ApiOperation({
    summary: 'Debug dos usuários — contagens por role sem dados sensíveis',
  })
  async handle() {
    const result = await this.debugUsuarios.execute()
    return result.value!
  }
}
