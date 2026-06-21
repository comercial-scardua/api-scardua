import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { OracleQueryConnectUseCase } from '../../../../domain/oracle-query/application/use-cases/oracle-query-connect'

@ApiTags('Oracle Query')
@ApiBearerAuth()
@Controller('oracle-query')
@UseGuards(PermissionsGuard)
export class OracleQueryConnectController {
  constructor(private oracleQueryConnect: OracleQueryConnectUseCase) {}

  @Post('connect')
  @HttpCode(200)
  @RequirePermission('oracle-query', 'access')
  @ApiOperation({ summary: 'Conectar ao Oracle via Bridge' })
  async handle(@Body() body: Record<string, unknown>) {
    const result = await this.oracleQueryConnect.execute(body)
    return result.value!
  }
}
