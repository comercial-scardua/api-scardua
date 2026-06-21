import { Controller, Get, HttpCode, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { DebugNcmFormatUseCase } from '../../../../domain/debug/application/use-cases/debug-ncm-format'

@ApiTags('Debug')
@ApiBearerAuth()
@Controller('')
@UseGuards(PermissionsGuard)
export class DebugNcmFormatController {
  constructor(private debugNcmFormat: DebugNcmFormatUseCase) {}

  @Get('debug-ncm-format')
  @HttpCode(200)
  @RequirePermission('debug', 'access')
  @ApiOperation({
    summary: 'Debug do formato dos NCMs — primeiros 5 registros completos',
  })
  async handle() {
    const result = await this.debugNcmFormat.execute()
    return result.value!
  }
}
