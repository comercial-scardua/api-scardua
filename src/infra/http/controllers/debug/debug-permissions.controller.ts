import { Controller, Get, HttpCode, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { DebugPermissionsUseCase } from '../../../../domain/debug/application/use-cases/debug-permissions'

@ApiTags('Debug')
@ApiBearerAuth()
@Controller('debug')
@UseGuards(PermissionsGuard)
export class DebugPermissionsController {
  constructor(private debugPermissions: DebugPermissionsUseCase) {}

  @Get('permissions')
  @HttpCode(200)
  @RequirePermission('debug', 'access')
  @ApiOperation({ summary: 'Listar todas as permissões cadastradas' })
  async handle() {
    const result = await this.debugPermissions.execute()
    return result.value!
  }
}
