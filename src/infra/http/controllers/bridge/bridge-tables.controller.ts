import { Controller, HttpCode, Post, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { BridgeTablesUseCase } from '../../../../domain/bridge/application/use-cases/bridge-tables'

@ApiTags('Bridge')
@ApiBearerAuth()
@Controller('bridge')
@UseGuards(PermissionsGuard)
export class BridgeTablesController {
  constructor(private bridgeTables: BridgeTablesUseCase) {}

  @Post('tables')
  @HttpCode(200)
  @RequirePermission('bridge', 'access')
  @ApiOperation({ summary: 'Listar tabelas disponíveis via Bridge' })
  async handle() {
    const result = await this.bridgeTables.execute()
    return result.value!
  }
}
