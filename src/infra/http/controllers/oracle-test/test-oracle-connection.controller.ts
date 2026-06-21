import { Controller, Get, HttpCode, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { TestOracleConnectionUseCase } from '../../../../domain/oracle-test/application/use-cases/test-oracle-connection'

@ApiTags('Oracle Test')
@ApiBearerAuth()
@Controller('oracle-test')
@UseGuards(PermissionsGuard)
export class TestOracleConnectionController {
  constructor(private testOracleConnection: TestOracleConnectionUseCase) {}

  @Get()
  @HttpCode(200)
  @RequirePermission('oracle-test', 'access')
  @ApiOperation({ summary: 'Testar conexão com o Oracle' })
  async handle() {
    const result = await this.testOracleConnection.execute()
    return result.value
  }
}
