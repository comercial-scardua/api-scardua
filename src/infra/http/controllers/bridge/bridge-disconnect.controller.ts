import { Controller, HttpCode, Post, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { BridgeDisconnectUseCase } from '../../../../domain/bridge/application/use-cases/bridge-disconnect'

@ApiTags('Bridge')
@ApiBearerAuth()
@Controller('bridge')
@UseGuards(PermissionsGuard)
export class BridgeDisconnectController {
  constructor(private bridgeDisconnect: BridgeDisconnectUseCase) {}

  @Post('disconnect')
  @HttpCode(200)
  @RequirePermission('bridge', 'access')
  @ApiOperation({ summary: 'Desconectar da Bridge' })
  async handle() {
    const result = await this.bridgeDisconnect.execute()
    return result.value!
  }
}
