import { Controller, Get, HttpCode, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../../../auth/guards/permissions.guard'
import { DebugNcmUseCase } from '../../../../domain/debug/application/use-cases/debug-ncm'

@ApiTags('Debug')
@ApiBearerAuth()
@Controller('')
@UseGuards(PermissionsGuard)
export class DebugNcmController {
  constructor(private debugNcm: DebugNcmUseCase) {}

  @Get('debug-ncm')
  @HttpCode(200)
  @RequirePermission('debug', 'access')
  @ApiOperation({ summary: 'Debug dos NCMs — total e amostra de 10' })
  async handle() {
    const result = await this.debugNcm.execute()
    return result.value!
  }
}
