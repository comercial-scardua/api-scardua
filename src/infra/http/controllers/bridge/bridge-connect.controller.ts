import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { BridgeConnectUseCase } from '../../../../domain/bridge/application/use-cases/bridge-connect'

@ApiTags('Bridge')
@ApiBearerAuth()
@Controller('bridge')
@UseGuards(PermissionsGuard)
export class BridgeConnectController {
  constructor(private bridgeConnect: BridgeConnectUseCase) {}

  @Post('connect')
  @HttpCode(200)
  @RequirePermission('bridge', 'access')
  @ApiOperation({ summary: 'Conectar ao Oracle via Bridge' })
  async handle(@Body() body: Record<string, unknown>) {
    const result = await this.bridgeConnect.execute(body)
    return result.value!
  }
}
