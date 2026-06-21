import { Controller, Get, HttpCode, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { DiagnoseNcmLimitUseCase } from '../../../../domain/ncm-utilities/application/use-cases/diagnose-ncm-limit'

@ApiTags('NCM Utilities')
@ApiBearerAuth()
@Controller('')
@UseGuards(PermissionsGuard)
export class DiagnoseNcmLimitController {
  constructor(private diagnoseNcmLimit: DiagnoseNcmLimitUseCase) {}

  @Get('diagnose-ncm-limit')
  @HttpCode(200)
  @RequirePermission('ncm-utilities', 'access')
  @ApiOperation({
    summary: 'Diagnosticar limite de NCMs — retorna contagem total',
  })
  async handle() {
    const result = await this.diagnoseNcmLimit.execute()
    return result.value
  }
}
