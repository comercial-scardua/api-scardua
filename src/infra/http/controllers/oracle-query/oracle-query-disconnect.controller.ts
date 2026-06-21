import { Controller, HttpCode, Post, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { OracleQueryDisconnectUseCase } from '../../../../domain/oracle-query/application/use-cases/oracle-query-disconnect'

@ApiTags('Oracle Query')
@ApiBearerAuth()
@Controller('oracle-query')
@UseGuards(PermissionsGuard)
export class OracleQueryDisconnectController {
  constructor(private oracleQueryDisconnect: OracleQueryDisconnectUseCase) {}

  @Post('disconnect')
  @HttpCode(200)
  @RequirePermission('oracle-query', 'access')
  @ApiOperation({ summary: 'Desconectar do Oracle' })
  async handle() {
    const result = await this.oracleQueryDisconnect.execute()
    return result.value!
  }
}
