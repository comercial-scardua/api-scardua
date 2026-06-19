import { Controller, Get, HttpCode, UseGuards } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../auth/guards/permissions.guard'

@ApiTags('Oracle Credentials')
@ApiBearerAuth()
@Controller('oracle-credentials')
@UseGuards(PermissionsGuard)
export class OracleCredentialsController {
  constructor(private readonly config: ConfigService) {}

  @Get()
  @HttpCode(200)
  @RequirePermission('oracle-credentials', 'access')
  @ApiOperation({
    summary: 'Retornar credenciais Oracle (sem dados sensíveis)',
  })
  getCredentials() {
    const host = this.config.get<string>('ORACLE_HOST') || 'não configurado'
    const port = this.config.get<string>('ORACLE_PORT') || '1521'
    const sid = this.config.get<string>('ORACLE_SID') || 'não configurado'
    const configured = !!this.config.get<string>('ORACLE_HOST')

    return { host, port, sid, configured }
  }
}
