import { Controller, Get, HttpCode, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { GetOracleCredentialsUseCase } from '../../../../domain/oracle-credentials/application/use-cases/get-oracle-credentials'

@ApiTags('Oracle Credentials')
@ApiBearerAuth()
@Controller('oracle-credentials')
@UseGuards(PermissionsGuard)
export class GetOracleCredentialsController {
  constructor(private getOracleCredentials: GetOracleCredentialsUseCase) {}

  @Get()
  @HttpCode(200)
  @RequirePermission('oracle-credentials', 'access')
  @ApiOperation({
    summary: 'Retornar credenciais Oracle (sem dados sensíveis)',
  })
  async handle() {
    const result = await this.getOracleCredentials.execute()
    return result.value
  }
}
